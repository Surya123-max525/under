import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Zap, ZapOff, Activity } from "lucide-react";

const THRESHOLD = 6;

const Index = () => {
  const [voltage, setVoltage] = useState(4);
  const [isOvervoltage, setIsOvervoltage] = useState(false);
  const isOn = isOvervoltage ? voltage <= THRESHOLD : voltage > THRESHOLD;
  const vSample = (voltage * 1) / 2.2;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container py-12">
        <header className="mx-auto max-w-3xl text-center animate-fade-in">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Activity className="h-3 w-3" /> Live Circuit Simulation
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            {isOvervoltage ? "Overvoltage" : "Undervoltage"} Protection Circuit
          </h1>
          <p className="mt-4 text-muted-foreground">
            A 6V Zener sets the comparator reference. {isOvervoltage 
              ? "When V1 exceeds the threshold, the op-amp drives the MOSFET OFF to protect the load."
              : "When V1 exceeds the threshold, the op-amp drives the MOSFET ON and the 12V bulb glows."}
          </p>
        </header>

        <section className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
          <Card className="relative overflow-hidden p-4 md:p-6 animate-scale-in">
            <Schematic isOn={isOn} voltage={voltage} isOvervoltage={isOvervoltage} />
          </Card>

          <div className="space-y-4">
            <Card className="p-6 animate-fade-in">
              <div className="mb-6 flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Overvoltage Protection</label>
                  <p className="text-xs text-muted-foreground">Isolate load when voltage exceeds 6V</p>
                </div>
                <Switch checked={isOvervoltage} onCheckedChange={setIsOvervoltage} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Input Voltage (V1)</span>
                <span className="text-2xl font-bold tabular-nums">{voltage.toFixed(1)} V</span>
              </div>
              <Slider
                className="mt-5"
                value={[voltage]}
                min={0}
                max={12}
                step={0.1}
                onValueChange={(v) => setVoltage(v[0])}
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>0V</span>
                <span className="text-foreground font-semibold">6V threshold</span>
                <span>12V</span>
              </div>
            </Card>

            <Card className="p-6 animate-fade-in">
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Live State</h3>
              <ul className="space-y-3 text-sm">
                <Row label={`${isOvervoltage ? 'V−' : 'V+'} (divider tap)`} value={`${vSample.toFixed(2)} V`} />
                <Row label={`${isOvervoltage ? 'V+' : 'V−'} (Zener ref)`} value="6.00 V" />
                <Row label="Comparator U1" value={isOn ? "HIGH" : "LOW"} on={isOn} />
                <Row label="MOSFET Q1" value={isOn ? "ON" : "OFF"} on={isOn} />
                <Row
                  label="Bulb X1"
                  value={isOn ? "GLOWING" : "OFF"}
                  on={isOn}
                  icon={isOn ? <Zap className="h-3.5 w-3.5" /> : <ZapOff className="h-3.5 w-3.5" />}
                />
              </ul>
            </Card>

            <Card
              className={`flex items-center gap-4 p-6 transition-colors duration-500 animate-fade-in ${
                isOn ? "bg-[hsl(48_100%_96%)] border-[hsl(48_100%_70%)]" : ""
              }`}
            >
              <Lightbulb
                className={`h-10 w-10 transition-all duration-500 ${
                  isOn ? "text-[hsl(45_100%_50%)] animate-glow-pulse" : "text-muted-foreground"
                }`}
              />
              <div>
                <p className="text-sm font-semibold">
                  {isOn 
                    ? (isOvervoltage ? "Safe voltage" : "Threshold exceeded") 
                    : (isOvervoltage ? "Overvoltage detected" : "Below threshold")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isOn
                    ? `${voltage.toFixed(1)}V ${isOvervoltage ? '≤' : '>'} 6V → load energized`
                    : `${voltage.toFixed(1)}V ${isOvervoltage ? '>' : '≤'} 6V → load isolated`}
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl animate-fade-in">
          <Card className="p-6">
            <h2 className="text-xl font-semibold">How it works</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {isOvervoltage 
                ? "The 6V Zener (D1) provides a reference at U1's non-inverting input (V+). The R1–R2 divider feeds a sample of V1 into U1's inverting input (V−). While V1 is low (safe), V− < V+ and U1 outputs HIGH, turning the MOSFET (Q1) ON and powering the bulb. When V1 climbs past 6V, V− exceeds the reference (V+), U1 swings LOW, and Q1 turns OFF, isolating the load to protect it from overvoltage."
                : "The 6V Zener (D1), biased through Rref, clamps a stable reference at U1's inverting input (V−). The R1–R2 divider feeds a sample of V1 — through R3 — into U1's non-inverting input (V+). While V1 is low, V+ < V− and U1 outputs LOW, leaving the IRFZ44N MOSFET (Q1) OFF — no current reaches the bulb. Once V1 climbs past 6V, V+ exceeds the reference, U1 swings HIGH, biases Q1's gate, and the 12V bulb conducts through Q1's drain–source path to ground."
              }
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
};

/* =========================================================
   Clean schematic — strict grid, labelled nets, no overlaps
   ========================================================= */
const Schematic = ({ isOn, voltage, isOvervoltage }: { isOn: boolean; voltage: number; isOvervoltage: boolean }) => {
  const wire = "hsl(var(--foreground))";
  const muted = "hsl(var(--muted-foreground))";
  const live = "hsl(45 95% 50%)";

  // Layout (px) — every node on 20px grid
  const W = 820;
  const H = 520;
  const TOP = 80;
  const BOT = 440;

  // columns
  const cV1 = 80;
  const cR1 = 220;
  const cRef = 340;
  const cU1in = 460;     // op-amp input pins x
  const cU1out = 560;    // op-amp output x
  const cQ1 = 680;
  const cBulb = 760;

  // op-amp body
  const opTop = 240;
  const opBot = 320;
  const opVplus = 260;   // y of + input pin
  const opVminus = 300;  // y of − input pin
  const opOutY = 280;    // y of output

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
        </pattern>
        <path id="flow-top" d={`M${cV1} ${TOP} H ${cBulb} V 280`} />
        <path id="flow-bottom" d={`M ${cBulb} 320 V 340 H ${cQ1 + 12} V ${BOT} H ${cV1} V ${TOP}`} />
      </defs>
      <rect width={W} height={H} fill="url(#grid2)" opacity="0.4" />

      {/* ===================== WIRES ===================== */}
      <g fill="none" stroke={wire} strokeWidth="2" strokeLinecap="square">
        {/* +V rail */}
        <path d={`M${cV1} ${TOP} H ${cBulb}`} />
        {/* GND rail */}
        <path d={`M${cV1} ${BOT} H ${cQ1 + 12}`} />
        {/* V1 left vertical */}
        <path d={`M${cV1} ${TOP} V ${BOT}`} />

        {/* R1 branch: top rail down to R1 top, R1 bottom to node A */}
        <path d={`M${cR1} ${TOP} V 140`} />
        <path d={`M${cR1} 200 V 280`} />            {/* node A at y=280 */}
        {/* R2: node A down to R2 top, R2 bottom to GND */}
        <path d={`M${cR1} 280 V 340`} />
        <path d={`M${cR1} 400 V ${BOT}`} />

        {/* Node A → R3 (horizontal) → V+ pin */}
        <path d={`M${cR1} 280 H 290`} />            {/* into R3 left */}
        <path d={`M 350 280 H ${cR1in_to_Vplus()}`} />

        {/* Rref branch: top rail → Rref → node B */}
        <path d={`M${cRef} ${TOP} V 140`} />
        <path d={`M${cRef} 200 V 320`} />           {/* node B at y=320 */}
        {/* Zener: node B → D1 → GND */}
        <path d={`M${cRef} 320 V 360`} />
        <path d={`M${cRef} 400 V ${BOT}`} />
        {/* node B → V− pin */}
        <path d={`M${cRef} 320 H ${cU1in}`} />

        {/* U1 output → MOSFET gate */}
        <path d={`M${cU1out} ${opOutY} H 620`} />
        <path d={`M 620 ${opOutY} V 360`} />   {/* down to gate level */}
        <path d={`M 620 360 H ${cQ1 - 18}`} /> {/* into gate */}

        {/* Bulb in series: top rail → bulb → MOSFET drain */}
        <path d={`M${cBulb} ${TOP} V 280`} />       {/* rail to bulb top */}
        <path d={`M${cBulb} 320 V 340`} />          {/* bulb bottom down */}
        <path d={`M${cBulb} 340 H ${cQ1 + 12}`} />  {/* over to drain */}

        {/* MOSFET source → GND */}
        <path d={`M${cQ1 + 12} 380 V ${BOT}`} />
      </g>

      {/* Animated current loop when ON */}
      {isOn && (
        <>
          <path
            d={`M${cV1} ${TOP} H ${cBulb} V 280 M ${cBulb} 320 V 340 H ${cQ1 + 12} V ${BOT} H ${cV1} V ${TOP}`}
            fill="none"
            stroke={live}
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="animate-current-flow"
            opacity="0.7"
          />
          <g fill={live}>
            {[0, -1.1].map((delay) => (
              <polygon key={`top-${delay}`} points="-6,-5 6,0 -6,5">
                <animateMotion dur="2.2s" begin={`${delay}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href="#flow-top" />
                </animateMotion>
              </polygon>
            ))}
            {[0, -0.96, -1.93].map((delay) => (
              <polygon key={`bot-${delay}`} points="-6,-5 6,0 -6,5">
                <animateMotion dur="2.9s" begin={`${delay}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href="#flow-bottom" />
                </animateMotion>
              </polygon>
            ))}
          </g>
        </>
      )}

      {/* Junction dots */}
      <g fill={wire}>
        <Dot x={cR1} y={TOP} />
        <Dot x={cR1} y={280} />
        <Dot x={cR1} y={BOT} />
        <Dot x={cRef} y={TOP} />
        <Dot x={cRef} y={320} />
        <Dot x={cRef} y={BOT} />
      </g>

      {/* Net labels — small chips floating above wires */}
      <NetLabel x={140} y={TOP - 10} text="+V" />
      <NetLabel x={140} y={BOT + 18} text="GND" />
      <NetLabel x={cR1 + 10} y={272} text={isOvervoltage ? "V−" : "V+"} />
      <NetLabel x={cRef + 10} y={312} text={isOvervoltage ? "V+" : "V−"} />
      <NetLabel x={590} y={opOutY - 8} text="OUT" />
      <NetLabel x={630} y={348} text="GATE" />

      {/* ===================== COMPONENTS ===================== */}
      {/* V1 source */}
      <g>
        <circle cx={cV1} cy={260} r={20} fill="hsl(var(--background))" stroke={wire} strokeWidth="2" />
        <text x={cV1} y={256} textAnchor="middle" fontSize="11" fontWeight="700" fill={wire}>+</text>
        <text x={cV1} y={272} textAnchor="middle" fontSize="11" fontWeight="700" fill={wire}>−</text>
        <text x={cV1 - 30} y={300} fontSize="11" fontWeight="600" fill={wire}>V1</text>
        <text x={cV1 - 30} y={314} fontSize="10" fill={muted}>{voltage.toFixed(1)} V</text>
      </g>

      {/* R1 (vertical) */}
      <ResistorV x={cR1} y={140} label="R1" value="1.2 kΩ" />
      {/* R2 (vertical) */}
      <ResistorV x={cR1} y={340} label="R2" value="1 kΩ" />
      {/* R3 (horizontal, between divider tap and V+) */}
      <ResistorH x={290} y={280} label="R3" value="1 kΩ" />
      {/* Rref (vertical) */}
      <ResistorV x={cRef} y={140} label="Rref" value="2.2 kΩ" />

      {/* D1 Zener */}
      <g transform={`translate(${cRef}, 380)`}>
        <polygon points="-10,-12 10,-12 0,8" fill={wire} />
        <path d="M-12 8 H 12 M-12 8 L-7 13 M12 8 L7 3" stroke={wire} strokeWidth="2" fill="none" />
        <text x={16} y={-2} fontSize="11" fontWeight="600" fill={wire}>D1</text>
        <text x={16} y={12} fontSize="10" fill={muted}>6 V</text>
      </g>

      {/* U1 op-amp */}
      <g>
        <polygon
          points={`${cU1in},${opTop} ${cU1in},${opBot} ${cU1out},${opOutY}`}
          fill="hsl(var(--background))"
          stroke={wire}
          strokeWidth="2"
        />
        <text x={cU1in + 12} y={opVplus + 4} fontSize="13" fontWeight="700" fill={wire}>{isOvervoltage ? "−" : "+"}</text>
        <text x={cU1in + 12} y={opVminus + 4} fontSize="13" fontWeight="700" fill={wire}>{isOvervoltage ? "+" : "−"}</text>
        <text x={cU1in + 36} y={opOutY + 4} fontSize="11" fontWeight="700" fill={wire}>U1</text>
        {/* output state dot */}
        <circle
          cx={cU1out}
          cy={opOutY}
          r="5"
          fill={isOn ? "hsl(140 70% 45%)" : "hsl(0 70% 55%)"}
          className="transition-colors duration-300"
        />
      </g>

      {/* MOSFET Q1 (n-channel enhancement) */}
      <g transform={`translate(${cQ1}, 360)`}>
        {/* gate stub */}
        <path d="M-18 0 H -8" stroke={wire} strokeWidth="2" />
        {/* gate vertical bar */}
        <path d="M-8 -16 V 16" stroke={wire} strokeWidth="2" />
        {/* channel */}
        <path d="M-2 -18 V -6 M-2 -2 V 2 M-2 6 V 18" stroke={wire} strokeWidth="2.5" />
        {/* drain/source connections */}
        <path d="M-2 -12 H 12 M-2 0 H 8 M-2 12 H 12" stroke={wire} strokeWidth="2" />
        <path d="M12 -12 V -20 M12 12 V 20" stroke={wire} strokeWidth="2" />
        {/* source arrow */}
        <polygon points="3,8 8,12 3,16" fill={wire} />
        {/* labels */}
        <text x={22} y={-4} fontSize="11" fontWeight="600" fill={wire}>Q1</text>
        <text x={22} y={10} fontSize="10" fill={muted}>IRFZ44N</text>
        <text x={-28} y={-4} fontSize="9" fill={muted}>G</text>
        <text x={16} y={-24} fontSize="9" fill={muted}>D</text>
        <text x={16} y={26} fontSize="9" fill={muted}>S</text>
      </g>

      {/* Bulb X1 */}
      <g transform={`translate(${cBulb}, 300)`}>
        <circle
          cx="0" cy="0" r="20"
          fill={isOn ? "hsl(48 100% 70%)" : "hsl(var(--secondary))"}
          stroke={wire} strokeWidth="2"
          className={isOn ? "animate-glow-pulse" : ""}
        />
        <path
          d="M-9 4 Q -4.5 -5 0 4 Q 4.5 -5 9 4"
          fill="none"
          stroke={isOn ? "hsl(20 100% 35%)" : wire}
          strokeWidth="1.5"
        />
        <text x={28} y={-4} fontSize="11" fontWeight="600" fill={wire}>X1</text>
        <text x={28} y={10} fontSize="10" fill={muted}>12V 10W</text>
      </g>

      {/* Ground symbol on rail */}
      <g transform={`translate(${(cV1 + cQ1) / 2}, ${BOT})`}>
        <path d="M0 0 V 10 M-10 10 H 10 M-7 14 H 7 M-4 18 H 4" stroke={wire} strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
};

// helper for V+ wire endpoint
function cR1in_to_Vplus() { return 460; }

const Dot = ({ x, y }: { x: number; y: number }) => (
  <circle cx={x} cy={y} r={3.5} />
);

const NetLabel = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <g>
    <rect x={x - 2} y={y - 11} width={text.length * 7 + 8} height={16} rx={3} fill="hsl(var(--background))" stroke="hsl(var(--border))" />
    <text x={x + 2} y={y + 1} fontSize="10" fontWeight="700" fill="hsl(var(--foreground))">{text}</text>
  </g>
);

const ResistorV = ({ x, y, label, value }: { x: number; y: number; label: string; value: string }) => {
  const wire = "hsl(var(--foreground))";
  const muted = "hsl(var(--muted-foreground))";
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-9} y={0} width={18} height={60} rx={3} fill="hsl(var(--background))" stroke={wire} strokeWidth="2" />
      <text x={16} y={24} fontSize="11" fontWeight="700" fill={wire}>{label}</text>
      <text x={16} y={38} fontSize="10" fill={muted}>{value}</text>
    </g>
  );
};

const ResistorH = ({ x, y, label, value }: { x: number; y: number; label: string; value: string }) => {
  const wire = "hsl(var(--foreground))";
  const muted = "hsl(var(--muted-foreground))";
  return (
    <g transform={`translate(${x}, ${y - 9})`}>
      <rect x={0} y={0} width={60} height={18} rx={3} fill="hsl(var(--background))" stroke={wire} strokeWidth="2" />
      <text x={30} y={-6} textAnchor="middle" fontSize="11" fontWeight="700" fill={wire}>{label}</text>
      <text x={30} y={32} textAnchor="middle" fontSize="10" fill={muted}>{value}</text>
    </g>
  );
};

const Row = ({
  label, value, on, icon,
}: { label: string; value: string; on?: boolean; icon?: React.ReactNode }) => (
  <li className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold transition-colors duration-300 ${
        on === undefined
          ? "bg-secondary text-foreground"
          : on
          ? "bg-[hsl(140_70%_92%)] text-[hsl(140_70%_25%)]"
          : "bg-[hsl(0_70%_94%)] text-[hsl(0_70%_35%)]"
      }`}
    >
      {icon}
      {value}
    </span>
  </li>
);

export default Index;
