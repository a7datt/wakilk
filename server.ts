import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES (Redirected to Supabase) ---

  app.get("/api/user/:id", async (req, res) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // Developer: Create Agent
  app.post("/api/developer/agents", async (req, res) => {
    const { id, developer_id, name, description, category, model, api_key, system_prompt, knowledge_base, customer_requirements, price, image_url } = req.body;
    const { error } = await supabase
      .from("agent_templates")
      .insert({
        id, 
        developer_id, 
        name, 
        description, 
        category, 
        model, 
        api_key, 
        system_prompt, 
        knowledge_base, 
        customer_requirements, 
        price, 
        image_url,
        status: 'published'
      });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.get("/api/developer/agents/:devId", async (req, res) => {
    const { data, error } = await supabase
      .from("agent_templates")
      .select("*")
      .eq("developer_id", req.params.devId);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // Catalog
  app.get("/api/catalog/agents", async (req, res) => {
    const { data, error } = await supabase
      .from("agent_templates")
      .select("*")
      .eq("status", "published");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // Purchase (Simplified for Supabase)
  app.post("/api/customer/purchase", async (req, res) => {
    const { userId, templateId } = req.body;
    
    try {
      // 1. Get user and template info
      const { data: user } = await supabase.from("users").select("balance").eq("id", userId).single();
      const { data: template } = await supabase.from("agent_templates").select("price, developer_id").eq("id", templateId).single();

      if (!user || user.balance < template.price) {
        return res.status(400).json({ error: "رصيد غير كافٍ" });
      }

      const instanceId = `inst_${Math.random().toString(36).substr(2, 9)}`;

      // Use a batch or sequential calls (Ideally a DB function/RPC for transaction)
      await supabase.from("users").update({ balance: user.balance - template.price }).eq("id", userId);
      await supabase.from("agent_instances").insert({ id: instanceId, user_id: userId, template_id: templateId });
      await supabase.from("users").update({ balance: Number((await supabase.from("users").select("balance").eq("id", template.developer_id).single()).data?.balance || 0) + template.price }).eq("id", template.developer_id);

      res.json({ success: true, instanceId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Configure
  app.post("/api/customer/configure", async (req, res) => {
    const { instanceId, configValues } = req.body;
    const { error } = await supabase
      .from("agent_instances")
      .update({ custom_config: configValues, status: 'configured' })
      .eq("id", instanceId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.get("/api/customer/instances/:userId", async (req, res) => {
    const { data, error } = await supabase
      .from("agent_instances")
      .select(`
        *,
        agent_templates (*)
      `)
      .eq("user_id", req.params.userId);
    
    if (error) return res.status(500).json({ error: error.message });
    
    // Format to match old structure
    const formatted = data.map(inst => ({
      ...inst,
      name: inst.agent_templates.name,
      model: inst.agent_templates.model,
      image_url: inst.agent_templates.image_url,
      category: inst.agent_templates.category,
      customer_requirements: inst.agent_templates.customer_requirements
    }));
    
    res.json(formatted);
  });

  app.get("/api/chat/context/:instanceId", async (req, res) => {
    try {
      const { data: instance, error } = await supabase
        .from("agent_instances")
        .select(`
          *,
          agent_templates (*)
        `)
        .eq("id", req.params.instanceId)
        .single();

      if (error || !instance) return res.status(404).json({ error: "الوكيل غير موجود" });

      const configValues = instance.custom_config || {};
      const configStr = Object.entries(configValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      const combinedPrompt = `${instance.agent_templates.system_prompt}\n\nسياق العميل المخصص:\n${configStr}\n\nقاعدة المعرفة:\n${instance.agent_templates.knowledge_base}`;

      res.json({
        systemInstruction: combinedPrompt,
        model: instance.agent_templates.model,
        apiKey: instance.agent_templates.api_key
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user/:id/recharge", async (req, res) => {
    const { amount } = req.body;
    const { data: user } = await supabase.from("users").select("balance").eq("id", req.params.id).single();
    const newBalance = (user?.balance || 0) + amount;
    
    await supabase.from("users").update({ balance: newBalance }).eq("id", req.params.id);
    res.json({ success: true, newBalance });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Wakeel Supabase-Integrated Server running on http://localhost:${PORT}`);
  });
}

startServer();
