import { useState, useRef } from "react";

const ALL_TEAMS = {
  eastern: [
    { id: "201", name: "Brandon Wheat Kings", abbr: "BDN", division: "East" },
    { id: "202", name: "Calgary Hitmen", abbr: "CGY", division: "Central" },
    { id: "204", name: "Saskatoon Blades", abbr: "SAS", division: "East" },
    { id: "205", name: "Lethbridge Hurricanes", abbr: "LET", division: "Central" },
    { id: "206", name: "Medicine Hat Tigers", abbr: "MH", division: "Central" },
    { id: "207", name: "Moose Jaw Warriors", abbr: "MJ", division: "East" },
    { id: "208", name: "Red Deer Rebels", abbr: "RD", division: "Central" },
    { id: "209", name: "Prince Albert Raiders", abbr: "PA", division: "East" },
    { id: "212", name: "Regina Pats", abbr: "REG", division: "East" },
    { id: "216", name: "Swift Current Broncos", abbr: "SC", division: "East" },
    { id: "203", name: "Edmonton Oil Kings", abbr: "EDM", division: "Central" },
  ],
  western: [
    { id: "213", name: "Kamloops Blazers", abbr: "KAM", division: "B.C." },
    { id: "220", name: "Kelowna Rockets", abbr: "KEL", division: "B.C." },
    { id: "214", name: "Seattle Thunderbirds", abbr: "SEA", division: "U.S." },
    { id: "215", name: "Spokane Chiefs", abbr: "SPO", division: "U.S." },
    { id: "217", name: "Tri-City Americans", abbr: "TRI", division: "U.S." },
    { id: "218", name: "Portland Winterhawks", abbr: "POR", division: "U.S." },
    { id: "221", name: "Prince George Cougars", abbr: "PG", division: "B.C." },
    { id: "222", name: "Wenatchee Wild", abbr: "WEN", division: "U.S." },
    { id: "223", name: "Vancouver Giants", abbr: "VAN", division: "B.C." },
    { id: "226", name: "Everett Silvertips", abbr: "EVT", division: "U.S." },
    { id: "227", name: "Victoria Royals", abbr: "VIC", division: "B.C." },
    { id: "277", name: "Penticton Vees", abbr: "PEN", division: "B.C." },
  ],
};

const LOGO = (id) => `https://assets.leaguestat.com/whl/logos/${id}.png`;
const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];
const WEST_CLR = "#8b1a1a";
const EAST_CLR = "#1a3a6e";
const GOLD = "#c99600";

// ── helpers ──────────────────────────────────────────────────────────────────

function buildR1(seeds) {
  const s = [...seeds].sort((a, b) => a.seed - b.seed);
  return [{ top: s[0], bot: s[7] }, { top: s[1], bot: s[6] }, { top: s[2], bot: s[5] }, { top: s[3], bot: s[4] }];
}
function reseedR2(winners) {
  const v = winners.filter(Boolean).sort((a, b) => a.seed - b.seed);
  return [{ top: v[0] || null, bot: v[3] || null }, { top: v[1] || null, bot: v[2] || null }];
}

// ── shared logo ───────────────────────────────────────────────────────────────

function Logo({ id, size = 28 }) {
  const [err, setErr] = useState(false);
  if (err) return <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, flexShrink: 0 }}>🏒</div>;
  return <img src={LOGO(id)} alt="" width={size} height={size} style={{ objectFit: "contain", flexShrink: 0 }} onError={() => setErr(true)} />;
}

// ── page 1: team selector ─────────────────────────────────────────────────────

function TeamSelector({ conference, selected, onToggle, onSeed }) {
  const teams = ALL_TEAMS[conference];
  const label = conference === "eastern" ? "Eastern Conference" : "Western Conference";
  const acc = conference === "eastern" ? EAST_CLR : WEST_CLR;
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: `2px solid ${acc}` }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: acc, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</h2>
        <span style={{ marginLeft: "auto", fontSize: 12, color: selected.length === 8 ? "#2d8a4e" : "var(--color-text-secondary)", fontWeight: 600 }}>{selected.length}/8</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {teams.map((team) => {
          const isSel = selected.some((s) => s.id === team.id);
          const entry = selected.find((s) => s.id === team.id);
          const canAdd = !isSel && selected.length < 8;
          return (
            <div key={team.id} onClick={() => (canAdd || isSel) && onToggle(team, conference)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, border: isSel ? `1.5px solid ${acc}50` : "1px solid var(--color-border-tertiary)", background: isSel ? `${acc}08` : "var(--color-background-primary)", opacity: !isSel && !canAdd ? 0.35 : 1, cursor: canAdd || isSel ? "pointer" : "default", transition: "all 0.12s" }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, border: isSel ? `2px solid ${acc}` : "1.5px solid var(--color-border-secondary)", background: isSel ? acc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {isSel && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <Logo id={team.id} size={26} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: isSel ? 600 : 400, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team.name}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{team.division} Division</div>
              </div>
              {isSel && (
                <div onClick={(e) => e.stopPropagation()}>
                  <select value={entry?.seed || ""} onChange={(e) => onSeed(team.id, conference, parseInt(e.target.value))}
                    style={{ fontSize: 12, padding: "2px 5px", borderRadius: 5, border: `1px solid ${acc}40`, background: "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: "pointer", minWidth: 64 }}>
                    <option value="">Seed</option>
                    {SEEDS.map((s) => { const taken = selected.find((sel) => sel.seed === s && sel.id !== team.id); return <option key={s} value={s} disabled={!!taken}>#{s}{taken ? ` (${taken.abbr})` : ""}</option>; })}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── page 2: interactive bracket ───────────────────────────────────────────────

function MatchupCard({ top, bot, result, onResult, acc }) {
  const winner = result?.winner;
  const games = result?.games;
  return (
    <div style={{ border: "1px solid var(--color-border-tertiary)", borderRadius: 7, overflow: "hidden", background: "var(--color-background-primary)", width: "100%" }}>
      {[top, bot].map((team, idx) => {
        const isWin = winner?.id === team?.id;
        const isLose = winner && team && winner.id !== team.id;
        return (
          <div key={idx} onClick={() => team && onResult({ winner: team, games: games || null })}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", cursor: team ? "pointer" : "default", background: isWin ? `${acc}14` : "transparent", borderBottom: idx === 0 ? "1px solid var(--color-border-tertiary)" : "none", opacity: isLose ? 0.38 : 1, minHeight: 34, transition: "background 0.1s" }}>
            {!team ? <div style={{ height: 18, flex: 1, borderRadius: 3, background: "var(--color-background-tertiary)", opacity: 0.4 }} /> : (
              <>
                <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 700, minWidth: 16 }}>#{team.seed}</span>
                <Logo id={team.id} size={20} />
                <span style={{ fontSize: 12, fontWeight: isWin ? 700 : 400, color: isWin ? "var(--color-text-primary)" : "var(--color-text-secondary)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team.name}</span>
                {isWin && <div style={{ width: 5, height: 5, borderRadius: "50%", background: acc, flexShrink: 0 }} />}
              </>
            )}
          </div>
        );
      })}
      {winner && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "var(--color-background-secondary)", borderTop: "1px solid var(--color-border-tertiary)" }}>
          <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Games:</span>
          {[4, 5, 6, 7].map((g) => (
            <button key={g} onClick={() => onResult({ winner, games: g })}
              style={{ padding: "1px 6px", fontSize: 10, borderRadius: 3, border: games === g ? `1.5px solid ${acc}` : "1px solid var(--color-border-tertiary)", background: games === g ? `${acc}15` : "transparent", color: games === g ? "var(--color-text-primary)" : "var(--color-text-secondary)", cursor: "pointer", fontWeight: games === g ? 700 : 400 }}>
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// West side: R1(far left) → R2 → R3(closest to center)
// East side: R3(closest to center) → R2 → R1(far right)
function BracketSide({ seeds, conference, bracketState, onBracketChange }) {
  const isWest = conference === "western";
  const acc = isWest ? WEST_CLR : EAST_CLR;
  const label = isWest ? "Western Conference" : "Eastern Conference";

  const r1m = buildR1(seeds);
  const r1w = r1m.map((_, i) => bracketState.r1?.[i]?.winner || null);
  const r2m = reseedR2(r1w);
  const r2w = r2m.map((_, i) => bracketState.r2?.[i]?.winner || null);
  const r3m = [{ top: r2w[0] || null, bot: r2w[1] || null }];
  const confChamp = bracketState.r3?.[0]?.winner || null;

  const set = (round, idx, result) => onBracketChange(conference, round, idx, result);

  const rounds = [
    { key: "r1", label: "Round 1", matchups: r1m, results: bracketState.r1 || [] },
    { key: "r2", label: "Round 2", matchups: r2m, results: bracketState.r2 || [] },
    { key: "r3", label: "Conf. Final", matchups: r3m, results: bracketState.r3 || [] },
  ];
  // West: [R1, R2, R3] — East: [R3, R2, R1] (mirrored toward center)
  const ordered = isWest ? rounds : [...rounds].reverse();

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, justifyContent: isWest ? "flex-start" : "flex-end" }}>
        {isWest && <div style={{ width: 4, height: 18, borderRadius: 2, background: acc }} />}
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: acc, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</h2>
        {!isWest && <div style={{ width: 4, height: 18, borderRadius: 2, background: acc }} />}
        {confChamp && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 10, background: `${acc}15`, border: `1px solid ${acc}30`, marginLeft: isWest ? "auto" : 0, marginRight: isWest ? 0 : "auto" }}>
            <Logo id={confChamp.id} size={15} />
            <span style={{ fontSize: 9, fontWeight: 700, color: acc }}>Conf. Champ</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 5, flex: 1, alignItems: "stretch" }}>
        {ordered.map((round) => (
          <div key={round.key} style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ textAlign: "center", fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: acc, marginBottom: 5, paddingBottom: 3, borderBottom: `1.5px solid ${acc}25`, fontFamily: "'Barlow Condensed',sans-serif" }}>{round.label}</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around", gap: 6 }}>
              {round.matchups.map((m, i) => (
                <MatchupCard key={i} top={m.top} bot={m.bot} result={round.results[i]} onResult={(r) => set(round.key, i, r)} acc={acc} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CenterChampionship({ eastChamp, westChamp, result, onResult }) {
  const winner = result?.winner;
  const games = result?.games;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 164, maxWidth: 190, padding: "0 6px" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: GOLD, fontFamily: "'Barlow Condensed',sans-serif" }}>WHL Championship</div>
        <div style={{ fontSize: 8, color: "var(--color-text-tertiary)", marginTop: 1 }}>Ed Chynoweth Cup</div>
      </div>
      {[{ team: westChamp, lbl: "West" }, { team: eastChamp, lbl: "East" }].map(({ team, lbl }, idx) => {
        const isWin = winner?.id === team?.id;
        const isLose = winner && team && winner.id !== team.id;
        return (
          <div key={lbl}>
            <div onClick={() => team && onResult({ winner: team, games: games || null })}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "7px 9px", borderRadius: 7, border: isWin ? `2px solid ${GOLD}` : "1px solid var(--color-border-tertiary)", background: isWin ? `${GOLD}12` : "var(--color-background-primary)", cursor: team ? "pointer" : "default", opacity: isLose ? 0.35 : 1, transition: "all 0.12s", marginBottom: idx === 0 ? 0 : 0 }}>
              {team ? (<><Logo id={team.id} size={26} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 9, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</div><div style={{ fontSize: 11, fontWeight: isWin ? 700 : 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team.name}</div></div>{isWin && <span style={{ fontSize: 14 }}>🏆</span>}</>) : (<span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontStyle: "italic" }}>{lbl} TBD</span>)}
            </div>
            {idx === 0 && <div style={{ textAlign: "center", fontSize: 18, padding: "4px 0", color: GOLD }}>🏆</div>}
          </div>
        );
      })}
      {winner && (
        <div style={{ marginTop: 6, display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
          {[4, 5, 6, 7].map((g) => (
            <button key={g} onClick={() => onResult({ winner, games: g })}
              style={{ padding: "2px 7px", fontSize: 10, borderRadius: 4, border: games === g ? `1.5px solid ${GOLD}` : "1px solid var(--color-border-tertiary)", background: games === g ? `${GOLD}20` : "transparent", color: games === g ? GOLD : "var(--color-text-secondary)", cursor: "pointer", fontWeight: games === g ? 700 : 400 }}>
              {g}
            </button>
          ))}
        </div>
      )}
      {winner && (
        <div style={{ marginTop: 8, textAlign: "center", padding: "8px 10px", borderRadius: 8, background: `${GOLD}12`, border: `1px solid ${GOLD}40`, width: "100%" }}>
          <div style={{ fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Champion</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4 }}>
            <Logo id={winner.id} size={24} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Barlow Condensed',sans-serif" }}>{winner.name}</span>
          </div>
          {games && <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", marginTop: 2 }}>in {games} games</div>}
        </div>
      )}
    </div>
  );
}

// ── page 3: final bracket (dark, export-ready) ────────────────────────────────

function FinalMatchupCard({ top, bot, result, acc }) {
  const winner = result?.winner;
  const games = result?.games;
  return (
    <div style={{ border: `1px solid ${acc}50`, borderRadius: 6, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
      {[top, bot].map((team, idx) => {
        const isWin = winner?.id === team?.id;
        const isLose = winner && team && winner.id !== team.id;
        return (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 7px", background: isWin ? `${acc}40` : "transparent", borderBottom: idx === 0 ? `1px solid ${acc}30` : "none", opacity: isLose ? 0.3 : 1, minHeight: 28 }}>
            {!team ? <div style={{ height: 14, flex: 1, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} /> : (
              <>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 700, minWidth: 12 }}>#{team.seed}</span>
                <Logo id={team.id} size={17} />
                <span style={{ fontSize: 11, fontWeight: isWin ? 700 : 400, color: isWin ? "#fff" : "rgba(255,255,255,0.65)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{team.name}</span>
                {isWin && games && <span style={{ fontSize: 9, color: acc === WEST_CLR ? "#e88080" : "#80a0e8", fontWeight: 700, flexShrink: 0 }}>{games}G</span>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FinalConferenceSide({ label, acc, r1res, r2res, r3res, seeds, mirrored }) {
  const r1m = buildR1(seeds);
  const r1w = r1m.map((_, i) => r1res[i]?.winner || null);
  const r2m = reseedR2(r1w);
  const r2w = r2m.map((_, i) => r2res[i]?.winner || null);
  const r3m = [{ top: r2w[0] || null, bot: r2w[1] || null }];

  const rounds = [
    { key: "r1", label: "Round 1", matchups: r1m, results: r1res },
    { key: "r2", label: "Round 2", matchups: r2m, results: r2res },
    { key: "r3", label: "Conf. Final", matchups: r3m, results: r3res },
  ];
  const ordered = mirrored ? [...rounds].reverse() : rounds;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ textAlign: mirrored ? "right" : "left", marginBottom: 8, paddingBottom: 5, borderBottom: `2px solid ${acc}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: acc, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {ordered.map((round) => (
          <div key={round.key} style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ textAlign: "center", fontSize: 8, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: acc, marginBottom: 5, paddingBottom: 2, borderBottom: `1px solid ${acc}35` }}>{round.label}</div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", flex: 1, gap: 5, minHeight: 260 }}>
              {round.matchups.map((m, i) => <FinalMatchupCard key={i} top={m.top} bot={m.bot} result={round.results[i]} acc={acc} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinalBracketView({ westSeeds, eastSeeds, bracketState }) {
  const westChamp = bracketState.western.r3?.[0]?.winner || null;
  const eastChamp = bracketState.eastern.r3?.[0]?.winner || null;
  const champ = bracketState.finals?.winner || null;
  const champGames = bracketState.finals?.games || null;

  return (
    <div style={{ background: "#0d1226", color: "#fff", padding: "24px 20px 20px", borderRadius: 14, fontFamily: "'Barlow Condensed',sans-serif" }}>
      {/* header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>WHL PLAYOFF PREDICTIONS</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", marginTop: 2 }}>2025–26 SEASON</div>
      </div>

      {/* bracket */}
      <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
        {/* West: R1→R2→R3 */}
        <FinalConferenceSide label="Western Conference" acc={WEST_CLR}
          seeds={westSeeds} r1res={bracketState.western.r1 || []} r2res={bracketState.western.r2 || []} r3res={bracketState.western.r3 || []} mirrored={false} />

        {/* Center championship */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 180, padding: "0 14px", alignSelf: "center" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: GOLD, textAlign: "center", marginBottom: 4, textTransform: "uppercase" }}>WHL Championship</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 12, textAlign: "center" }}>Ed Chynoweth Cup</div>

          {[{ team: westChamp, lbl: "West" }, { team: eastChamp, lbl: "East" }].map(({ team, lbl }, idx) => {
            const isWin = champ?.id === team?.id;
            const isLose = champ && team && champ.id !== team.id;
            return (
              <div key={lbl} style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderRadius: 7, border: isWin ? `1.5px solid ${GOLD}` : "1px solid rgba(255,255,255,0.15)", background: isWin ? `${GOLD}20` : "rgba(255,255,255,0.06)", opacity: isLose ? 0.3 : 1, marginBottom: idx === 0 ? 0 : 0 }}>
                  {team ? (<><Logo id={team.id} size={28} /><div style={{ flex: 1 }}><div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</div><div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{team.name}</div></div>{isWin && <span style={{ fontSize: 16 }}>🏆</span>}</>) : (<span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{lbl} TBD</span>)}
                </div>
                {idx === 0 && <div style={{ textAlign: "center", fontSize: 22, padding: "6px 0", color: GOLD }}>🏆</div>}
              </div>
            );
          })}

          {champ && (
            <div style={{ marginTop: 14, textAlign: "center", padding: "12px 14px", borderRadius: 10, background: `${GOLD}20`, border: `1.5px solid ${GOLD}60`, width: "100%" }}>
              <div style={{ fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>🏆 WHL Champion</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
                <Logo id={champ.id} size={36} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{champ.name}</div>
                  {champGames && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>in {champGames} games</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* East: R3←R2←R1 (mirrored) */}
        <FinalConferenceSide label="Eastern Conference" acc={EAST_CLR}
          seeds={eastSeeds} r1res={bracketState.eastern.r1 || []} r2res={bracketState.eastern.r2 || []} r3res={bracketState.eastern.r3 || []} mirrored={true} />
      </div>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
        WHL PLAYOFF PREDICTOR • whl.ca
      </div>
    </div>
  );
}

// ── export helper ─────────────────────────────────────────────────────────────

async function exportEl(ref) {
  if (!ref.current) return;
  if (!window.html2canvas) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const canvas = await window.html2canvas(ref.current, { backgroundColor: "#0d1226", scale: 2, useCORS: true, allowTaint: true, logging: false });
  const a = document.createElement("a");
  a.download = "whl-playoff-bracket.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
}

// ── main app ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("select");
  const [eastSel, setEastSel] = useState([]);
  const [westSel, setWestSel] = useState([]);
  const [bracket, setBracket] = useState({ eastern: { r1: [], r2: [], r3: [] }, western: { r1: [], r2: [], r3: [] }, finals: null });
  const [exporting, setExporting] = useState(false);
  const finalRef = useRef(null);

  const toggle = (team, conf) => {
    const set = conf === "eastern" ? setEastSel : setWestSel;
    set((p) => p.find((t) => t.id === team.id) ? p.filter((t) => t.id !== team.id) : p.length >= 8 ? p : [...p, { ...team, seed: null }]);
  };
  const seed = (id, conf, s) => {
    const set = conf === "eastern" ? setEastSel : setWestSel;
    set((p) => p.map((t) => t.id === id ? { ...t, seed: s } : t.seed === s ? { ...t, seed: null } : t));
  };

  const allSeeds = (arr) => arr.length === 8 && arr.every((t) => t.seed);
  const canProceed = allSeeds(eastSel) && allSeeds(westSel);

  const updateBracket = (conf, round, idx, result) => {
    setBracket((prev) => {
      const c = { ...prev[conf] };
      if (round === "r1") { const r1 = [...(c.r1 || [])]; r1[idx] = result; return { ...prev, [conf]: { r1, r2: [], r3: [] }, finals: null }; }
      if (round === "r2") { const r2 = [...(c.r2 || [])]; r2[idx] = result; return { ...prev, [conf]: { ...c, r2, r3: [] }, finals: null }; }
      const r3 = [...(c.r3 || [])]; r3[idx] = result;
      return { ...prev, [conf]: { ...c, r3 }, finals: null };
    });
  };

  const eastChamp = bracket.eastern.r3?.[0]?.winner || null;
  const westChamp = bracket.western.r3?.[0]?.winner || null;

  const handleExport = async () => {
    setExporting(true);
    try { await exportEl(finalRef); } catch { alert("Export failed. Please screenshot manually."); }
    setExporting(false);
  };

  const NAV = [
    { key: "select", label: "1. Select Teams", ok: true },
    { key: "bracket", label: "2. Fill Bracket", ok: canProceed },
    { key: "final", label: "3. Final Bracket", ok: canProceed },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* nav */}
      <div style={{ background: "#0d1226", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 14px rgba(0,0,0,0.45)" }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.1 }}>WHL Playoff Predictor</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>2025–26 Season</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>
          {NAV.map(({ key, label, ok }) => (
            <button key={key} onClick={() => ok && setPage(key)} disabled={!ok}
              style={{ padding: "5px 12px", borderRadius: 6, border: page === key ? `1px solid ${GOLD}60` : "1px solid rgba(255,255,255,0.18)", background: page === key ? `${GOLD}20` : "transparent", color: page === key ? GOLD : ok ? "#fff" : "rgba(255,255,255,0.28)", cursor: ok ? "pointer" : "not-allowed", fontSize: 12, fontWeight: page === key ? 700 : 400, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.03em" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── page 1 ── */}
      {page === "select" && (
        <div style={{ padding: "20px 16px", maxWidth: 920, margin: "0 auto" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: "0.03em" }}>Select Playoff Teams</h1>
          <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--color-text-secondary)" }}>Pick 8 teams per conference and assign each a seed (1–8) to generate the bracket.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            <TeamSelector conference="western" selected={westSel} onToggle={toggle} onSeed={seed} />
            <TeamSelector conference="eastern" selected={eastSel} onToggle={toggle} onSeed={seed} />
          </div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {!canProceed && <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0 }}>{eastSel.length < 8 || westSel.length < 8 ? `Need ${Math.max(0, 8 - westSel.length)} more West · ${Math.max(0, 8 - eastSel.length)} more East` : "Assign all seeds to continue"}</p>}
            <button onClick={() => canProceed && setPage("bracket")} disabled={!canProceed}
              style={{ padding: "11px 28px", borderRadius: 8, border: "none", background: canProceed ? "#0d1226" : "var(--color-background-tertiary)", color: canProceed ? "#fff" : "var(--color-text-tertiary)", cursor: canProceed ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Generate Bracket →
            </button>
          </div>
        </div>
      )}

      {/* ── page 2 ── */}
      {page === "bracket" && (
        <div style={{ padding: "14px 12px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h1 style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: "0.03em" }}>2025–26 WHL Playoffs</h1>
              <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>Click a team to pick the winner · select number of games played</p>
            </div>
            <button onClick={() => setPage("final")}
              style={{ padding: "8px 18px", borderRadius: 8, border: `2px solid ${GOLD}`, background: GOLD, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Generate Final Bracket →
            </button>
          </div>
          {/* West | Championship | East */}
          <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <BracketSide seeds={westSel} conference="western" bracketState={bracket.western} onBracketChange={updateBracket} />
            <CenterChampionship eastChamp={eastChamp} westChamp={westChamp} result={bracket.finals} onResult={(r) => setBracket((p) => ({ ...p, finals: r }))} />
            <BracketSide seeds={eastSel} conference="eastern" bracketState={bracket.eastern} onBracketChange={updateBracket} />
          </div>
        </div>
      )}

      {/* ── page 3: final bracket ── */}
      {page === "final" && (
        <div style={{ padding: "16px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase" }}>Final Bracket</h1>
              <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>Your completed predictions — export as a PNG to save or share</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPage("bracket")}
                style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Barlow Condensed',sans-serif" }}>
                ← Edit Bracket
              </button>
              <button onClick={handleExport} disabled={exporting}
                style={{ padding: "8px 18px", borderRadius: 8, border: `2px solid ${GOLD}`, background: exporting ? `${GOLD}20` : GOLD, color: exporting ? GOLD : "#fff", cursor: exporting ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {exporting ? "Exporting…" : "Export PNG"}
              </button>
            </div>
          </div>
          <div ref={finalRef}>
            <FinalBracketView westSeeds={westSel} eastSeeds={eastSel} bracketState={bracket} />
          </div>
        </div>
      )}
    </>
  );
}
