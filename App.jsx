import { useState, useRef } from "react";

// ─── 冰箱款式對應的層 ────────────────────────────────────────
const fridgeTypeShelvesMap = {
  double: [
    { id: "door", label: "門架", zone: "冷藏", icon: "🚪" },
    { id: "freeze", label: "冷凍 A", zone: "冷凍", icon: "❄️" },
    { id: "fridge1", label: "冷藏 A", zone: "冷藏", icon: "🌡️" },
    { id: "fridge2", label: "冷藏 B", zone: "冷藏", icon: "🌡️" },
  ],
  triple: [
    { id: "door", label: "門架", zone: "冷藏", icon: "🚪" },
    { id: "freeze", label: "冷凍 A", zone: "冷凍", icon: "❄️" },
    { id: "fridge1", label: "冷藏 A", zone: "冷藏", icon: "🌡️" },
    { id: "veg", label: "蔬果 A", zone: "冷藏", icon: "🥦" },
  ],
  five: [
    { id: "door", label: "門架", zone: "冷藏", icon: "🚪" },
    { id: "freeze1", label: "冷凍 A", zone: "冷凍", icon: "❄️" },
    { id: "freeze2", label: "冷凍 B", zone: "冷凍", icon: "❄️" },
    { id: "fridge1", label: "冷藏 A", zone: "冷藏", icon: "🌡️" },
    { id: "fridge2", label: "冷藏 B", zone: "冷藏", icon: "🌡️" },
  ],
  six: [
    { id: "door", label: "門架", zone: "冷藏", icon: "🚪" },
    { id: "freeze1", label: "冷凍 A", zone: "冷凍", icon: "❄️" },
    { id: "freeze2", label: "冷凍 B", zone: "冷凍", icon: "❄️" },
    { id: "fridge1", label: "冷藏 A", zone: "冷藏", icon: "🌡️" },
    { id: "fridge2", label: "冷藏 B", zone: "冷藏", icon: "🌡️" },
    { id: "fridge3", label: "冷藏 C", zone: "冷藏", icon: "🌡️" },
  ],
};

// ─── 初始資料 ────────────────────────────────────────────────
const initialItems = [
  { id: 1, name: "雞腿", category: "肉類", zone: "冷藏", shelf: "fridge1", daysLeft: 1, owner: null, emoji: "🍗" },
  { id: 2, name: "菠菜", category: "蔬菜", zone: "冷藏", shelf: "veg", daysLeft: 2, owner: null, emoji: "🥬" },
  { id: 3, name: "豆腐", category: "豆製品", zone: "冷藏", shelf: "fridge2", daysLeft: 3, owner: "小美", emoji: "⬜" },
  { id: 4, name: "牛奶", category: "乳製品", zone: "冷藏", shelf: "door", daysLeft: 5, owner: null, emoji: "🥛" },
  { id: 5, name: "冷凍水餃", category: "冷凍食品", zone: "冷凍", shelf: "freeze1", daysLeft: 30, owner: null, emoji: "🥟" },
  { id: 6, name: "雞蛋", category: "蛋類", zone: "冷藏", shelf: "door", daysLeft: 14, owner: null, emoji: "🥚" },
  { id: 7, name: "番茄", category: "蔬菜", zone: "冷藏", shelf: "veg", daysLeft: 4, owner: "阿明", emoji: "🍅" },
  { id: 8, name: "優格", category: "乳製品", zone: "冷藏", shelf: "fridge2", daysLeft: 7, owner: null, emoji: "🫙" },
];

const initialCondiments = [
  { id: 101, name: "醬油", emoji: "🫙", storage: "常溫", openedDaysAgo: 20, shelfDays: 180, opened: true },
  { id: 102, name: "米酒", emoji: "🍶", storage: "常溫", openedDaysAgo: 60, shelfDays: 365, opened: true },
  { id: 103, name: "奶油", emoji: "🧈", storage: "冷藏", openedDaysAgo: 5, shelfDays: 30, opened: true },
  { id: 104, name: "味噌", emoji: "🟤", storage: "冷藏", openedDaysAgo: 10, shelfDays: 90, opened: true },
  { id: 105, name: "辣椒醬", emoji: "🌶️", storage: "常溫", openedDaysAgo: 3, shelfDays: 120, opened: true },
  { id: 106, name: "橄欖油", emoji: "🫒", storage: "常溫", openedDaysAgo: 0, shelfDays: 365, opened: false },
];

const fridgeTypes = [
  { id: "double", label: "上下兩格", desc: "上冷凍・下冷藏" },
  { id: "triple", label: "三格", desc: "上冷凍・中冷藏・下蔬果" },
  { id: "five", label: "五格", desc: "法式單門・四層下櫃" },
  { id: "six", label: "六格", desc: "法式對開・四層下櫃" },
];

const categoryColors = {
  肉類: "#FF6B6B", 蔬菜: "#51CF66", 豆製品: "#FAB005",
  乳製品: "#74C0FC", 冷凍食品: "#A9E4FF", 蛋類: "#FFD43B",
  調味料: "#D9A6FF", 熟食: "#FF9500", 其他: "#C0C0C0",
};

// ─── 工具函式 ────────────────────────────────────────────────
const getUrgencyColor = (d) => d <= 3 ? "#FF4444" : d <= 14 ? "#FF9500" : "#34C759";
const getUrgencyBg = (d) => d <= 3 ? "rgba(255,68,68,0.1)" : d <= 14 ? "rgba(255,149,0,0.1)" : "rgba(52,199,89,0.08)";
const getDaysLabel = (d) => d <= 0 ? "已過期！" : d === 1 ? "明天到期！" : `${d} 天後到期`;
const getCondimentDaysLeft = (c) => c.opened ? c.shelfDays - c.openedDaysAgo : null;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function compressImage(file, maxPx = 1000) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82).split(",")[1]);
    };
    img.src = url;
  });
}

// ─── Claude API ──────────────────────────────────────────────
async function scanWithGemini(base64, mediaType, mode) {
  const schema = `{"foods":[{"name":"品名","emoji":"emoji","category":"肉類/蔬菜/豆製品/乳製品/冷凍食品/蛋類/其他","zone":"冷藏或冷凍","daysLeft":數字}],"condiments":[{"name":"品名","emoji":"emoji","storage":"常溫或冷藏","shelfDays":數字}]}`;
  const days = `生肉3葉菜3根莖7豆腐3蛋14奶7冷凍30`;
  const cond = `醬油180油365米酒365味噌90番茄醬60辣椒醬120奶油30`;
  const prompt = mode === "receipt"
    ? `收據辨識食材與調味料，只回傳純JSON無markdown：${schema} 食材天數:${days} 調味料效期:${cond}`
    : `照片辨識食材與調味料，只回傳純JSON無markdown：${schema} 食材天數:${days}`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [
          { inline_data: { mime_type: mediaType, data: base64 } },
          { text: prompt }
        ]}],
        generationConfig: { maxOutputTokens: 800 }
      })
    }
  );
  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text.trim().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

async function fetchAIRecipes(ingredients, condiments) {
  const foodList = ingredients.map(i => `${i.name}（${i.daysLeft}天後到期）`).join("、");
  const condList = condiments.filter(c => c.opened).map(c => c.name).join("、");
  const condNote = condList ? `\n手邊現有調味料：${condList}` : "";
  const prompt = `你是台灣家常料理達人。根據以下快過期食材推薦3道料理：${foodList}${condNote}\n請優先使用手邊調味料，步驟中自然標注用量。只回傳純 JSON 陣列：[{"name":"料理名","time":"xx分鐘","difficulty":"簡單/普通","emoji":"emoji","keywords":["食材1"],"condimentsUsed":["調味料1"],"portions":"x人份","steps":["步驟一","步驟二"]}]`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000 }
      })
    }
  );
  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text.trim().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

// ─── 冰箱視覺 ────────────────────────────────────────────────
const zoneS = (h) => ({ background: h ? "rgba(100,180,255,0.12)" : "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" });
const zL = (t) => <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>{t}</span>;
function FridgeShape({ type }) {
  const outer = { width: "130px", height: "200px", background: "linear-gradient(160deg,#2a3a5c,#1a2540)", borderRadius: "16px", border: "2px solid rgba(100,180,255,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" };
  const handle = { width: "5px", height: "30px", background: "rgba(255,255,255,0.15)", borderRadius: "3px", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" };
  if (type === "double") return <div style={outer}><div style={{ ...zoneS(true), flex: 1 }}>{zL("冷凍")}</div><div style={{ ...zoneS(false), flex: 2, borderBottom: "none" }}>{zL("冷藏")}</div><div style={handle} /></div>;
  if (type === "triple") return <div style={outer}><div style={{ ...zoneS(true), flex: 1 }}>{zL("冷凍")}</div><div style={{ ...zoneS(false), flex: 1.5 }}>{zL("冷藏")}</div><div style={{ ...zoneS(false), flex: 1, borderBottom: "none" }}>{zL("蔬果")}</div><div style={handle} /></div>;
  if (type === "five") return <div style={outer}><div style={{ ...zoneS(false), flex: 1.5 }}>{zL("冷藏")}</div><div style={{ ...zoneS(false), flex: 1 }}>{zL("冷藏")}</div><div style={{ flex: 1, display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><div style={{ flex: 1, ...zoneS(true), borderRight: "1px solid rgba(255,255,255,0.06)", borderBottom: "none" }}>{zL("製冰")}</div><div style={{ flex: 2, ...zoneS(true), borderBottom: "none" }}>{zL("冷凍")}</div></div><div style={{ ...zoneS(true), flex: 1, borderBottom: "none" }}>{zL("冷凍")}</div><div style={handle} /></div>;
  if (type === "six") return <div style={outer}><div style={{ flex: 1.5, display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><div style={{ flex: 1, ...zoneS(false), borderRight: "1px solid rgba(255,255,255,0.06)", borderBottom: "none" }}>{zL("冷藏")}</div><div style={{ flex: 1.2, ...zoneS(false), borderBottom: "none" }}>{zL("冷藏")}</div></div><div style={{ ...zoneS(false), flex: 1 }}>{zL("冷藏")}</div><div style={{ flex: 1, display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><div style={{ flex: 1, ...zoneS(true), borderRight: "1px solid rgba(255,255,255,0.06)", borderBottom: "none" }}>{zL("製冰")}</div><div style={{ flex: 2, ...zoneS(true), borderBottom: "none" }}>{zL("冷凍")}</div></div><div style={{ ...zoneS(true), flex: 1, borderBottom: "none" }}>{zL("冷凍")}</div><div style={handle} /></div>;
  return null;
}

// ─── 初始設定 (onboarding) ───────────────────────────────────
function Onboarding({ onDone }) {
  const [selected, setSelected] = useState(null);
  const [shelves, setShelves] = useState([]);
  const [step, setStep] = useState(1); // 1=選款式 2=命名層

  const handleSelectFridge = (id) => {
    setSelected(id);
    setShelves(fridgeTypeShelvesMap[id].map(s => ({ ...s })));
  };

  const handleNext = () => setStep(2);
  const handleDone = () => onDone(selected, shelves);

  return (
    <div style={{ padding: "8px 0 16px" }}>
      {step === 1 && (
        <>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", textAlign: "center", margin: "8px 0 20px" }}>選擇你家的冰箱款式</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {fridgeTypes.map(f => (
              <div key={f.id} onClick={() => handleSelectFridge(f.id)} style={{ background: selected === f.id ? "rgba(100,180,255,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${selected === f.id ? "rgba(100,180,255,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: "16px", padding: "16px 12px", cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <FridgeShape type={f.id} />
                <div><p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: "0 0 2px" }}>{f.label}</p><p style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", margin: 0 }}>{f.desc}</p></div>
              </div>
            ))}
          </div>
          {selected && <button onClick={handleNext} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#4C9BE8,#2E6FBF)", border: "none", borderRadius: "16px", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>下一步 →</button>}
        </>
      )}
      {step === 2 && (
        <>
          <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", marginBottom: "16px", padding: 0 }}>← 返回</button>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", textAlign: "center", margin: "0 0 16px" }}>幫每一層取個好記的名字（可以直接用預設）</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {shelves.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "12px 14px" }}>
                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                <input
                  value={s.label}
                  onChange={e => setShelves(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                  style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: "14px", fontWeight: "600", padding: "4px 0", outline: "none", fontFamily: "inherit" }}
                />
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", background: s.zone === "冷凍" ? "rgba(100,180,255,0.15)" : "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: "6px" }}>{s.zone}</span>
              </div>
            ))}
          </div>
          <button onClick={handleDone} style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#34C759,#2aab4e)", border: "none", borderRadius: "16px", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>完成設定 ✓</button>
        </>
      )}
    </div>
  );
}

// ─── 冰箱分層視圖 ────────────────────────────────────────────
function FridgeShelfView({ shelves, items, onScan, onAddCooked }) {
  const [openShelf, setOpenShelf] = useState(null);

  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {shelves.map(shelf => {
          const shelfItems = items.filter(i => i.shelf === shelf.id);
          const urgent = shelfItems.filter(i => i.daysLeft <= 3).length;
          const isOpen = openShelf === shelf.id;
          return (
            <div key={shelf.id}>
              <div onClick={() => setOpenShelf(isOpen ? null : shelf.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: isOpen ? "rgba(100,180,255,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${isOpen ? "rgba(100,180,255,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: isOpen ? "16px 16px 0 0" : "16px", padding: "14px 16px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>{shelf.icon}</span>
                  <div>
                    <p style={{ color: "white", fontSize: "14px", fontWeight: "600", margin: 0 }}>{shelf.label}</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: "2px 0 0" }}>{shelfItems.length} 樣食材</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {urgent > 0 && <span style={{ background: "rgba(255,68,68,0.2)", border: "1px solid rgba(255,68,68,0.4)", borderRadius: "8px", padding: "2px 8px", color: "#FF4444", fontSize: "11px", fontWeight: "700" }}>{urgent} 即期</span>}
                  {/* emoji preview */}
                  <span style={{ fontSize: "13px" }}>{shelfItems.slice(0, 3).map(i => i.emoji).join("")}{shelfItems.length > 3 ? "…" : ""}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ background: "rgba(100,180,255,0.05)", border: "1px solid rgba(100,180,255,0.15)", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "8px 12px 12px" }}>
                  {shelfItems.length === 0
                    ? <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", textAlign: "center", padding: "12px 0", margin: 0 }}>這層是空的</p>
                    : <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {shelfItems.sort((a, b) => shelf.id === "door" ? a.name.localeCompare(b.name, "zh-TW") : a.daysLeft - b.daysLeft).map(item => (
                          <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: getUrgencyBg(item.daysLeft), border: `1px solid ${getUrgencyColor(item.daysLeft)}22`, borderRadius: "12px", padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ fontSize: "20px" }}>{item.emoji}</span>
                              <div>
                                <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0 }}>{item.name}</p>
                                <span style={{ background: (categoryColors[item.category] || "#C0C0C0") + "33", color: categoryColors[item.category] || "#C0C0C0", fontSize: "10px", fontWeight: "600", padding: "1px 6px", borderRadius: "5px" }}>{item.category}</span>
                              </div>
                            </div>
                            <p style={{ color: getUrgencyColor(item.daysLeft), fontSize: "12px", fontWeight: "700", margin: 0 }}>{getDaysLabel(item.daysLeft)}</p>
                          </div>
                        ))}
                      </div>
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button onClick={onScan} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "16px", color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>📸 掃描新增</button>
        <button onClick={onAddCooked} style={{ flex: 1, padding: "14px", background: "rgba(255,149,0,0.08)", border: "1px dashed rgba(255,149,0,0.3)", borderRadius: "16px", color: "rgba(255,149,0,0.6)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>🍱 新增熟食</button>
      </div>
    </div>
  );
}

// ─── 新增熟食 Modal ──────────────────────────────────────────
function AddCookedModal({ onClose, onConfirm, shelves }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍱");
  const [shelf, setShelf] = useState(shelves[0]?.id || null);

  const emojiOptions = ["🍱", "🍲", "🥘", "🍛", "🍝", "🥗", "🍜", "🥩", "🍗", "🍚"];

  const handleSubmit = () => {
    if (!name.trim()) return;
    onConfirm({ name: name.trim(), emoji, shelf, category: "熟食", zone: "冷藏", daysLeft: 5 });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "390px", background: "linear-gradient(180deg,#1a1f35,#0f1220)", borderRadius: "28px 28px 0 0", padding: "24px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", margin: 0 }}>🍱 新增熟食</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: "32px", height: "32px", color: "rgba(255,255,255,0.5)", fontSize: "16px", cursor: "pointer" }}>✕</button>
        </div>

        {/* emoji 選擇 */}
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" }}>選個 emoji</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {emojiOptions.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{ width: "40px", height: "40px", borderRadius: "12px", border: `1px solid ${emoji === e ? "rgba(255,149,0,0.6)" : "rgba(255,255,255,0.1)"}`, background: emoji === e ? "rgba(255,149,0,0.15)" : "rgba(255,255,255,0.04)", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{e}</button>
          ))}
        </div>

        {/* 名稱輸入 */}
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" }}>料理名稱</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="例：紅燒肉、炒飯、滷蛋"
          style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px", padding: "14px 16px", color: "white", fontSize: "15px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "20px" }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
        />

        {/* 選層 */}
        {shelves.length > 0 && (
          <>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" }}>放哪層？</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              {shelves.filter(s => s.zone === "冷藏").map(s => (
                <button key={s.id} onClick={() => setShelf(s.id)} style={{ padding: "8px 14px", borderRadius: "10px", border: `1px solid ${shelf === s.id ? "rgba(100,180,255,0.6)" : "rgba(255,255,255,0.1)"}`, background: shelf === s.id ? "rgba(100,180,255,0.15)" : "transparent", color: shelf === s.id ? "#74C0FC" : "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>{s.icon} {s.label}</button>
              ))}
            </div>
          </>
        )}

        {/* 說明 */}
        <div style={{ background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.2)", borderRadius: "12px", padding: "10px 14px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>⏱</span>
          <p style={{ color: "rgba(255,149,0,0.8)", fontSize: "12px", margin: 0 }}>熟食從今天起算，<strong>5天內</strong>食用完畢</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          style={{ width: "100%", padding: "16px", background: name.trim() ? "linear-gradient(135deg,#FF9500,#FF6B35)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: "16px", color: name.trim() ? "white" : "rgba(255,255,255,0.3)", fontSize: "15px", fontWeight: "700", cursor: name.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
          ✓ 加入冰箱
        </button>
      </div>
    </div>
  );
}

// ─── 掃描 Modal ──────────────────────────────────────────────
function ScanModal({ onClose, onConfirm, shelves }) {
  const [mode, setMode] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState(null);
  const [scanned, setScanned] = useState(null);
  const [error, setError] = useState(null);
  const [removedFoods, setRemovedFoods] = useState([]);
  const [removedConds, setRemovedConds] = useState([]);
  const [foodShelves, setFoodShelves] = useState({}); // idx → shelfId
  const cameraRef = useRef();
  const uploadRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setError(null); setScanned(null); setRemovedFoods([]); setRemovedConds([]); setFoodShelves({});
    setPreview(URL.createObjectURL(file));
    setScanning(true);
    try {
      const base64 = await compressImage(file);
      const result = await scanWithGemini(base64, "image/jpeg", mode);
      setScanned(result);
    } catch { setError("辨識失敗，請再試一次 😅"); }
    finally { setScanning(false); }
  };

  const foods = scanned?.foods?.filter((_, i) => !removedFoods.includes(i)) || [];
  const conds = scanned?.condiments?.filter((_, i) => !removedConds.includes(i)) || [];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "390px", background: "linear-gradient(180deg,#1a1f35,#0f1220)", borderRadius: "28px 28px 0 0", padding: "24px 20px 40px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", margin: 0 }}>📸 掃描新增</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: "32px", height: "32px", color: "rgba(255,255,255,0.5)", fontSize: "16px", cursor: "pointer" }}>✕</button>
        </div>

        {!mode && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[{ id: "receipt", emoji: "🧾", label: "拍收據 / 發票", desc: "自動抓出食材與調味料清單" }, { id: "food", emoji: "🥦", label: "拍食材 / 調味料", desc: "辨識眼前的食物或醬料" }].map(m => (
              <div key={m.id} onClick={() => setMode(m.id)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ fontSize: "32px" }}>{m.emoji}</span>
                <div><p style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>{m.label}</p><p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: "2px 0 0" }}>{m.desc}</p></div>
              </div>
            ))}
          </div>
        )}

        {mode && !preview && (
          <div>
            <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", marginBottom: "16px", padding: 0 }}>← 返回</button>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => cameraRef.current.click()} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg,#4C9BE8,#2E6FBF)", border: "none", borderRadius: "14px", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>📷 相機</button>
              <button onClick={() => uploadRef.current.click()} style={{ flex: 1, padding: "14px", background: "linear-gradient(135deg,#6B48FF,#4B2FBF)", border: "none", borderRadius: "14px", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>🖼 相簿</button>
            </div>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            <input ref={uploadRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
          </div>
        )}

        {preview && (
          <div>
            <img src={preview} alt="" style={{ width: "100%", borderRadius: "16px", marginBottom: "16px", maxHeight: "160px", objectFit: "cover" }} />
            {scanning && <div style={{ textAlign: "center", padding: "20px 0" }}><div style={{ display: "inline-block", width: "28px", height: "28px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #4C9BE8", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: "10px" }} /><p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>AI 辨識中…</p></div>}
            {error && <div style={{ textAlign: "center" }}><p style={{ color: "#FF4444", fontSize: "13px", marginBottom: "12px" }}>{error}</p><button onClick={() => { setPreview(null); setError(null); }} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontFamily: "inherit" }}>重新拍攝</button></div>}

            {scanned && (
              <div>
                {/* 食材 + 選層 */}
                {scanned.foods?.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" }}>🥬 食材（選填放哪層）</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {scanned.foods.map((item, i) => (
                        <div key={i} style={{ background: removedFoods.includes(i) ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)", border: `1px solid ${removedFoods.includes(i) ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)"}`, borderRadius: "14px", padding: "10px 12px", opacity: removedFoods.includes(i) ? 0.4 : 1, transition: "all 0.2s" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: removedFoods.includes(i) ? 0 : "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "20px" }}>{item.emoji}</span>
                              <div>
                                <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0 }}>{item.name}</p>
                                <span style={{ color: getUrgencyColor(item.daysLeft), fontSize: "10px", fontWeight: "600" }}>約 {item.daysLeft} 天・{item.zone}</span>
                              </div>
                            </div>
                            <button onClick={() => setRemovedFoods(r => r.includes(i) ? r.filter(x => x !== i) : [...r, i])} style={{ background: removedFoods.includes(i) ? "rgba(52,199,89,0.2)" : "rgba(255,68,68,0.15)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: removedFoods.includes(i) ? "#34C759" : "#FF4444", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>{removedFoods.includes(i) ? "+" : "✕"}</button>
                          </div>
                          {!removedFoods.includes(i) && shelves.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                              {shelves.map(s => (
                                <button key={s.id} onClick={() => setFoodShelves(prev => ({ ...prev, [i]: foodShelves[i] === s.id ? null : s.id }))} style={{ padding: "4px 10px", borderRadius: "8px", border: `1px solid ${foodShelves[i] === s.id ? "rgba(100,180,255,0.6)" : "rgba(255,255,255,0.1)"}`, background: foodShelves[i] === s.id ? "rgba(100,180,255,0.2)" : "transparent", color: foodShelves[i] === s.id ? "#74C0FC" : "rgba(255,255,255,0.35)", fontSize: "10px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>{s.icon} {s.label}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 調味料 */}
                {scanned.condiments?.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" }}>🧂 調味料</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {scanned.condiments.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: removedConds.includes(i) ? "rgba(255,255,255,0.02)" : "rgba(217,166,255,0.08)", border: `1px solid ${removedConds.includes(i) ? "rgba(255,255,255,0.05)" : "rgba(217,166,255,0.2)"}`, borderRadius: "12px", padding: "10px 12px", opacity: removedConds.includes(i) ? 0.4 : 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "18px" }}>{item.emoji}</span>
                            <div>
                              <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0 }}>{item.name}</p>
                              <span style={{ color: "#D9A6FF", fontSize: "10px" }}>開封後 {item.shelfDays} 天・{item.storage}</span>
                            </div>
                          </div>
                          <button onClick={() => setRemovedConds(r => r.includes(i) ? r.filter(x => x !== i) : [...r, i])} style={{ background: removedConds.includes(i) ? "rgba(52,199,89,0.2)" : "rgba(255,68,68,0.15)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: removedConds.includes(i) ? "#34C759" : "#FF4444", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>{removedConds.includes(i) ? "+" : "✕"}</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => { setPreview(null); setScanned(null); }} style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "13px", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>重掃</button>
                  <button onClick={() => onConfirm(foods, conds, foodShelves, scanned?.foods || [])} style={{ flex: 2, padding: "13px", background: "linear-gradient(135deg,#34C759,#2aab4e)", border: "none", borderRadius: "13px", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>✓ 加入（{foods.length + conds.length} 樣）</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── 調味料櫃 ────────────────────────────────────────────────
function CondimentShelf({ condiments, setCondiments }) {
  const openCondiment = (id) => setCondiments(prev => prev.map(c => c.id === id ? { ...c, opened: true, openedDaysAgo: 0 } : c));
  const groups = [
    { label: "⚠️ 快過期", items: condiments.filter(c => c.opened && getCondimentDaysLeft(c) <= 14 && getCondimentDaysLeft(c) > 0) },
    { label: "🟣 常溫", items: condiments.filter(c => c.storage === "常溫" && (!c.opened || getCondimentDaysLeft(c) > 14)) },
    { label: "❄️ 需冷藏", items: condiments.filter(c => c.storage === "冷藏" && (!c.opened || getCondimentDaysLeft(c) > 14)) },
  ];
  return (
    <div>
      {groups.map(g => g.items.length > 0 && (
        <div key={g.label} style={{ marginBottom: "20px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "12px 0 8px 4px" }}>{g.label}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {g.items.map(c => {
              const d = getCondimentDaysLeft(c);
              return (
                <div key={c.id} style={{ background: c.opened ? getUrgencyBg(d) : "rgba(255,255,255,0.04)", border: `1px solid ${c.opened ? getUrgencyColor(d) + "33" : "rgba(217,166,255,0.15)"}`, borderRadius: "16px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "24px" }}>{c.emoji}</span>
                    <div>
                      <p style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>{c.name}</p>
                      <div style={{ display: "flex", gap: "6px", marginTop: "3px" }}>
                        <span style={{ background: "rgba(217,166,255,0.15)", color: "#D9A6FF", fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "6px" }}>{c.storage}</span>
                        {c.opened ? <span style={{ color: getUrgencyColor(d), fontSize: "11px", fontWeight: "600" }}>剩 {d} 天</span> : <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>未開封</span>}
                      </div>
                    </div>
                  </div>
                  {!c.opened
                    ? <button onClick={() => openCondiment(c.id)} style={{ background: "rgba(217,166,255,0.15)", border: "1px solid rgba(217,166,255,0.3)", borderRadius: "10px", padding: "6px 12px", color: "#D9A6FF", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>標記開封</button>
                    : <div style={{ textAlign: "right" }}><p style={{ color: getUrgencyColor(d), fontSize: "12px", fontWeight: "700", margin: 0 }}>{getDaysLabel(d)}</p><p style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", margin: "2px 0 0" }}>開封後{c.openedDaysAgo}天</p></div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 主程式 ──────────────────────────────────────────────────
export default function FridgeApp() {
  const [items, setItems] = useState(initialItems);
  const [condiments, setCondiments] = useState(initialCondiments);
  const [fridgeType, setFridgeType] = useState(null);   // null = 未設定
  const [shelves, setShelves] = useState([]);
  const [activeTab, setActiveTab] = useState("urgent");
  const [recipeDays, setRecipeDays] = useState(3);
  const [removedRecipeItems, setRemovedRecipeItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [recipeError, setRecipeError] = useState(null);
  const [showScan, setShowScan] = useState(false);
  const [showAddCooked, setShowAddCooked] = useState(false);
  const [addedBanner, setAddedBanner] = useState(null);

  const recipeIngredients = items.filter(i => i.daysLeft <= recipeDays && !removedRecipeItems.includes(i.id));
  const urgentFoods = items.filter(i => i.daysLeft <= 7).sort((a, b) => a.daysLeft - b.daysLeft);
  const urgentConds = condiments.filter(c => c.opened && getCondimentDaysLeft(c) <= 14 && getCondimentDaysLeft(c) > 0).sort((a, b) => getCondimentDaysLeft(a) - getCondimentDaysLeft(b));

  const handleOnboardingDone = (type, sh) => {
    setFridgeType(type);
    setShelves(sh);
  };

  const handleAddCooked = (item) => {
    setItems(prev => [...prev, { ...item, id: Date.now(), owner: null }]);
    setShowAddCooked(false);
    setAddedBanner("熟食已加入冰箱 🍱");
    setTimeout(() => setAddedBanner(null), 3000);
  };

  const handleScanConfirm = (newFoods, newConds, foodShelvesMap, allScannedFoods) => {
    const foodsWithId = newFoods.map((item, idx) => {
      const origIdx = allScannedFoods.findIndex(f => f.name === item.name);
      return { ...item, id: Date.now() + idx, owner: null, shelf: foodShelvesMap[origIdx] || null };
    });
    const condsWithId = newConds.map((item, idx) => ({ ...item, id: Date.now() + 1000 + idx, opened: false, openedDaysAgo: 0 }));
    setItems(prev => [...prev, ...foodsWithId]);
    setCondiments(prev => [...prev, ...condsWithId]);
    setShowScan(false);
    setAddedBanner(`已新增 ${foodsWithId.length + condsWithId.length} 樣 🎉`);
    setTimeout(() => setAddedBanner(null), 3000);
  };

  const handleGetRecipes = async () => {
    setLoadingRecipes(true); setRecipeError(null); setRecipes([]);
    try { setRecipes(await fetchAIRecipes(recipeIngredients, condiments)); }
    catch { setRecipeError("食譜生成失敗，請再試一次 😅"); }
    finally { setLoadingRecipes(false); }
  };

  const ItemCard = ({ item }) => (
    <div style={{ background: getUrgencyBg(item.daysLeft), border: `1px solid ${getUrgencyColor(item.daysLeft)}33`, borderRadius: "16px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "24px" }}>{item.emoji}</span>
        <div>
          <p style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>{item.name}</p>
          <div style={{ display: "flex", gap: "6px", marginTop: "3px" }}>
            <span style={{ background: (categoryColors[item.category] || "#C0C0C0") + "33", color: categoryColors[item.category] || "#C0C0C0", fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "6px" }}>{item.category}</span>
            {item.shelf && shelves.length > 0 && <span style={{ background: "rgba(100,180,255,0.1)", color: "rgba(100,180,255,0.8)", fontSize: "10px", padding: "2px 7px", borderRadius: "6px" }}>{shelves.find(s => s.id === item.shelf)?.label || ""}</span>}
            {item.owner && <span style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: "10px", padding: "2px 7px", borderRadius: "6px" }}>👤 {item.owner}</span>}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ color: getUrgencyColor(item.daysLeft), fontSize: "13px", fontWeight: "700", margin: 0 }}>{getDaysLabel(item.daysLeft)}</p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: "2px 0 0" }}>{item.zone}</p>
      </div>
    </div>
  );

  const tabs = [
    { key: "urgent", label: "⚡ 快過期" },
    { key: "fridge", label: "🧊 冰箱" },
    { key: "inventory", label: "📦 縱覽" },
    { key: "condiment", label: "🧂 調味料" },
    { key: "recipe", label: "🍳 食譜" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 50%,#0f0f1a 100%)", fontFamily: "'Noto Sans TC', sans-serif", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px 16px" }}>
      {showAddCooked && <AddCookedModal onClose={() => setShowAddCooked(false)} onConfirm={handleAddCooked} shelves={shelves} />}
      {showScan && <ScanModal onClose={() => setShowScan(false)} onConfirm={handleScanConfirm} shelves={shelves} />}
      {addedBanner && <div style={{ position: "fixed", top: "24px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#34C759,#2aab4e)", borderRadius: "14px", padding: "12px 20px", color: "white", fontSize: "14px", fontWeight: "700", zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>{addedBanner}</div>}

      <div style={{ width: "100%", maxWidth: "390px", background: "rgba(255,255,255,0.04)", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div style={{ padding: "28px 24px 16px", background: "linear-gradient(180deg,rgba(255,255,255,0.06) 0%,transparent 100%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0, letterSpacing: "2px", textTransform: "uppercase" }}>我的冰箱</p>
              <h1 style={{ color: "white", fontSize: "26px", fontWeight: "700", margin: "4px 0 0" }}>食材管家 🧊</h1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ background: "rgba(255,68,68,0.2)", border: "1px solid rgba(255,68,68,0.4)", borderRadius: "12px", padding: "6px 12px", textAlign: "center" }}>
                  <p style={{ color: "#FF4444", fontSize: "18px", fontWeight: "700", margin: 0 }}>{urgentFoods.filter(i => i.daysLeft <= 3).length + urgentConds.filter(c => getCondimentDaysLeft(c) <= 7).length}</p>
                  <p style={{ color: "rgba(255,68,68,0.7)", fontSize: "10px", margin: 0 }}>緊急</p>
                </div>
                <div style={{ background: "rgba(217,166,255,0.15)", border: "1px solid rgba(217,166,255,0.3)", borderRadius: "12px", padding: "6px 12px", textAlign: "center" }}>
                  <p style={{ color: "#D9A6FF", fontSize: "18px", fontWeight: "700", margin: 0 }}>{condiments.length}</p>
                  <p style={{ color: "rgba(217,166,255,0.7)", fontSize: "10px", margin: 0 }}>調味料</p>
                </div>
              </div>
              <button onClick={() => setShowScan(true)} style={{ background: "linear-gradient(135deg,#4C9BE8,#2E6FBF)", border: "none", borderRadius: "10px", padding: "7px 12px", color: "white", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>📸 掃描新增</button>
            </div>
          </div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: "16px", padding: "4px", marginTop: "20px", gap: "2px" }}>
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, padding: "8px 2px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: "600", fontFamily: "inherit", background: activeTab === tab.key ? "white" : "transparent", color: activeTab === tab.key ? "#1a1a2e" : "rgba(255,255,255,0.5)" }}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: "8px 16px 32px" }}>

          {/* ⚡ 快過期 */}
          {activeTab === "urgent" && (
            <div>
              {urgentFoods.length === 0 && urgentConds.length === 0 && <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center", padding: "32px 0" }}>目前沒有快過期的東西 🎉</p>}
              {urgentFoods.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "12px 0 8px 4px" }}>🥬 食材</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{urgentFoods.map(item => <ItemCard key={item.id} item={item} />)}</div>
                </div>
              )}
              {urgentConds.length > 0 && (
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "12px 0 8px 4px" }}>🧂 調味料</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {urgentConds.map(c => {
                      const d = getCondimentDaysLeft(c);
                      return (
                        <div key={c.id} style={{ background: getUrgencyBg(d), border: `1px solid ${getUrgencyColor(d)}33`, borderRadius: "16px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "24px" }}>{c.emoji}</span>
                            <div>
                              <p style={{ color: "white", fontSize: "15px", fontWeight: "600", margin: 0 }}>{c.name}</p>
                              <span style={{ background: "rgba(217,166,255,0.15)", color: "#D9A6FF", fontSize: "10px", fontWeight: "600", padding: "2px 7px", borderRadius: "6px" }}>調味料・{c.storage}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ color: getUrgencyColor(d), fontSize: "13px", fontWeight: "700", margin: 0 }}>{getDaysLabel(d)}</p>
                            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: "2px 0 0" }}>開封後{c.openedDaysAgo}天</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 🧊 冰箱（分層） */}
          {activeTab === "fridge" && (
            !fridgeType
              ? <Onboarding onDone={handleOnboardingDone} />
              : <FridgeShelfView shelves={shelves} items={items} onScan={() => setShowScan(true)} onAddCooked={() => setShowAddCooked(true)} />
          )}

          {/* 📦 縱覽 */}
          {activeTab === "inventory" && (
            <div>
              {["冷藏", "冷凍"].map(zone => {
                const zItems = items.filter(i => i.zone === zone).sort((a, b) => a.daysLeft - b.daysLeft);
                return (
                  <div key={zone} style={{ marginBottom: "20px" }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "12px 0 8px 4px" }}>{zone === "冷藏" ? "🌡️ 冷藏" : "❄️ 冷凍"} · {zItems.length} 樣</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{zItems.map(item => <ItemCard key={item.id} item={item} />)}</div>
                  </div>
                );
              })}
              <button onClick={() => setShowScan(true)} style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "16px", color: "rgba(255,255,255,0.35)", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>📸 掃描新增食材</button>
            </div>
          )}

          {/* 🧂 調味料 */}
          {activeTab === "condiment" && (
            <div>
              <CondimentShelf condiments={condiments} setCondiments={setCondiments} />
              <button onClick={() => setShowScan(true)} style={{ width: "100%", marginTop: "8px", padding: "16px", background: "rgba(217,166,255,0.06)", border: "1px dashed rgba(217,166,255,0.25)", borderRadius: "16px", color: "rgba(217,166,255,0.45)", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>📸 掃描收據新增調味料</button>
            </div>
          )}

          {/* 🍳 食譜 */}
          {activeTab === "recipe" && (
            <div>
              {selectedRecipe ? (
                <div>
                  <button onClick={() => setSelectedRecipe(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px", padding: "8px 12px", color: "rgba(255,255,255,0.5)", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", marginBottom: "16px" }}>← 返回</button>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "20px" }}>
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                      <span style={{ fontSize: "48px" }}>{selectedRecipe.emoji}</span>
                      <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", margin: "8px 0 4px" }}>{selectedRecipe.name}</h2>
                      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>⏱ {selectedRecipe.time}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>👨‍🍳 {selectedRecipe.difficulty}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>🍽 {selectedRecipe.portions}</span>
                      </div>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" }}>主要食材</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                      {(selectedRecipe.keywords || []).map((ing, i) => (<span key={i} style={{ background: "rgba(255,149,0,0.15)", border: "1px solid rgba(255,149,0,0.3)", color: "#FF9500", fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "8px" }}>{ing}</span>))}
                    </div>
                    {selectedRecipe.condimentsUsed?.length > 0 && (
                      <div style={{ marginBottom: "12px" }}>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" }}>🧂 用到的調味料</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {selectedRecipe.condimentsUsed.map((c, i) => (<span key={i} style={{ background: "rgba(217,166,255,0.15)", border: "1px solid rgba(217,166,255,0.3)", color: "#D9A6FF", fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "8px" }}>{c}</span>))}
                        </div>
                      </div>
                    )}
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px" }}>步驟</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(selectedRecipe.steps || []).map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                          <div style={{ minWidth: "24px", height: "24px", background: "linear-gradient(135deg,#FF6B35,#FF4444)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontSize: "11px", fontWeight: "700" }}>{i + 1}</span></div>
                          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "12px 0 10px 4px" }}>選擇食材範圍</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    {[1, 3, 7].map(d => (
                      <button key={d} onClick={() => { setRecipeDays(d); setRecipes([]); setRemovedRecipeItems([]); }} style={{ flex: 1, padding: "10px", borderRadius: "12px", border: `1px solid ${recipeDays === d ? "rgba(255,149,0,0.6)" : "rgba(255,255,255,0.1)"}`, background: recipeDays === d ? "rgba(255,149,0,0.15)" : "transparent", color: recipeDays === d ? "#FF9500" : "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>{d} 天內</button>
                    ))}
                  </div>
                  {recipeIngredients.length === 0 ? (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>此範圍內沒有快過期食材</p>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                      {recipeIngredients.map(item => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "6px", background: getUrgencyBg(item.daysLeft), border: `1px solid ${getUrgencyColor(item.daysLeft)}44`, borderRadius: "20px", padding: "6px 12px" }}>
                          <span style={{ fontSize: "16px" }}>{item.emoji}</span>
                          <span style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{item.name}</span>
                          <button onClick={() => setRemovedRecipeItems(r => [...r, item.id])} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "18px", height: "18px", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {recipeIngredients.length > 0 && (
                    <button onClick={handleGetRecipes} disabled={loadingRecipes} style={{ width: "100%", padding: "16px", background: loadingRecipes ? "rgba(255,107,53,0.4)" : "linear-gradient(135deg,#FF6B35,#FF4444)", border: "none", borderRadius: "16px", color: "white", fontSize: "15px", fontWeight: "700", cursor: loadingRecipes ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: "16px" }}>
                      {loadingRecipes ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}><span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />AI 正在想食譜…</span> : "✨ AI 幫我推薦食譜"}
                    </button>
                  )}
                  {recipeError && <p style={{ color: "#FF4444", fontSize: "13px", textAlign: "center", margin: "0 0 12px" }}>{recipeError}</p>}
                  {recipes.length > 0 && (
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px 4px" }}>AI 推薦食譜</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {recipes.map((r, i) => (
                          <div key={i} onClick={() => setSelectedRecipe(r)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "16px", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,149,0,0.4)"} onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                              <span style={{ fontSize: "28px" }}>{r.emoji}</span>
                              <div style={{ flex: 1 }}>
                                <p style={{ color: "white", fontSize: "15px", fontWeight: "700", margin: 0 }}>{r.name}</p>
                                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>⏱ {r.time}</span>
                                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>👨‍🍳 {r.difficulty}</span>
                                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>🍽 {r.portions}</span>
                                </div>
                              </div>
                              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>›</span>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {(r.keywords || []).map((ing, j) => (<span key={j} style={{ background: "rgba(255,149,0,0.15)", border: "1px solid rgba(255,149,0,0.3)", color: "#FF9500", fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "6px" }}>{ing}</span>))}
                              {(r.condimentsUsed || []).map((c, j) => (<span key={"c"+j} style={{ background: "rgba(217,166,255,0.12)", border: "1px solid rgba(217,166,255,0.25)", color: "#D9A6FF", fontSize: "11px", fontWeight: "600", padding: "3px 8px", borderRadius: "6px" }}>🧂{c}</span>))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
