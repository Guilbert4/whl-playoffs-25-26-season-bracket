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
    <div style={{ border: "1px solid var(--color-border-tertiary)", borderRadius: 7, overflow: "hidden", background: "var(--color-background-primary)", width: "100%", textAlign: "center" }}>
      {[top, bot].map((team, idx) => {
        const isWin = winner?.id === team?.id;
        const isLose = winner && team && winner.id !== team.id;
        return (
          <div key={idx} onClick={() => team && onResult({ winner: team, games: games || null })}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "6px 8px", cursor: team ? "pointer" : "default", background: isWin ? `${acc}14` : "transparent", borderBottom: idx === 0 ? "1px solid var(--color-border-tertiary)" : "none", opacity: isLose ? 0.38 : 1, minHeight: 34, transition: "background 0.1s", textAlign: "center", width: "100%" }}>
            {!team ? <div style={{ height: 18, flex: 1, borderRadius: 3, background: "var(--color-background-tertiary)", opacity: 0.4 }} /> : (
              <>
                <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 700, minWidth: 16, textAlign: "center" }}>#{team.seed}</span>
                <Logo id={team.id} size={20} />
                <span style={{ fontSize: 12, fontWeight: isWin ? 700 : 400, color: isWin ? "var(--color-text-primary)" : "var(--color-text-secondary)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "center" }}>{team.name}</span>
                {isWin && <div style={{ width: 5, height: 5, borderRadius: "50%", background: acc, flexShrink: 0 }} />}
                {result?.games && winner?.id === team?.id && (
                  <span style={{
                    fontSize: 10,
                    color: acc,
                    fontWeight: 700,
                    marginLeft: 6,
                    textAlign: "center",
                    display: "inline-block",
                    background: "#f6f6f6",
                    borderRadius: 4,
                    padding: "1px 7px",
                    minWidth: 0,
                    width: "auto",
                    whiteSpace: "nowrap"
                  }}>({result.games} games)</span>
                )}
              </>
            )}
          </div>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: "var(--color-background-secondary)", borderTop: "1px solid var(--color-border-tertiary)", justifyContent: "center", textAlign: "center" }}>
        <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center" }}>Games:</span>
        {[4, 5, 6, 7].map((g) => (
          <button key={g} onClick={() => winner && onResult({ winner, games: g })}
            style={{ padding: "1px 6px", fontSize: 10, borderRadius: 3, border: games === g ? `1.5px solid ${acc}` : "1px solid var(--color-border-tertiary)", background: games === g ? `${acc}15` : "transparent", color: games === g ? "var(--color-text-primary)" : "var(--color-text-secondary)", cursor: winner ? "pointer" : "not-allowed", fontWeight: games === g ? 700 : 400, textAlign: "center" }}>
            {g}
          </button>
        ))}
      </div>
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
    { key: "r1", label: "Rou d1d 1", matchups: r1m, results: bracketState.r1 || [] },
    { key: "r2", label: "Rou d1d 2", matchups: r2m, results: bracketState.r2 || [] },
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 164, maxWidth: 190, padding: "0 6px", textAlign: "center" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: GOLD, fontFamily: "'Barlow Condensed',sans-serif" }}>WHL Championship</div>
        <div style={{ fontSize: 8, color: "var(--color-text-tertiary)", marginTop: 1 }}>Ed Chynoweth Cup</div>
      </div>
      {[{ team: westChamp, lbl: "West" }, { team: eastChamp, lbl: "East" }].map(({ team, lbl }, idx) => {
        const isWin = winner?.id === team?.id;
        const isLose = winner && team && winner.id !== team.id;
        return (
          <div key={lbl} style={{ width: "100%", textAlign: "center" }}>
            <div onClick={() => team && onResult({ winner: team, games: games || null })}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "7px 9px", borderRadius: 7, border: isWin ? `2px solid ${GOLD}` : "1px solid var(--color-border-tertiary)", background: isWin ? `${GOLD}12` : "var(--color-background-primary)", cursor: team ? "pointer" : "default", opacity: isLose ? 0.35 : 1, transition: "all 0.12s", marginBottom: idx === 0 ? 0 : 0, textAlign: "center" }}>
              {team ? (<><Logo id={team.id} size={26} /><div style={{ flex: 1, minWidth: 0, textAlign: "center" }}><div style={{ fontSize: 9, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>{lbl}</div><div style={{ fontSize: 11, fontWeight: isWin ? 700 : 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "center" }}>{team.name}</div></div>{isWin && <span style={{ fontSize: 14 }}>🏆</span>}{result?.games && winner?.id === team?.id && (<span style={{
                fontSize: 10,
                color: GOLD,
                fontWeight: 700,
                marginLeft: 6,
                textAlign: "center",
                display: "inline-block",
                background: "#f6f6f6",
                borderRadius: 4,
                padding: "1px 7px",
                minWidth: 0,
                width: "auto",
                whiteSpace: "nowrap"
              }}>({result.games} games)</span>)}</>) : (<span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontStyle: "italic" }}>{lbl} TBD</span>)}
            </div>
            {idx === 0 && <div style={{ textAlign: "center", fontSize: 18, padding: "4px 0", color: GOLD }}>🏆</div>}
          </div>
        );
      })}
      <div style={{ marginTop: 6, display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", textAlign: "center" }}>
        {[4, 5, 6, 7].map((g) => (
          <button key={g} onClick={() => winner && onResult({ winner, games: g })}
            style={{ padding: "2px 7px", fontSize: 10, borderRadius: 4, border: games === g ? `1.5px solid ${GOLD}` : "1px solid var(--color-border-tertiary)", background: games === g ? `${GOLD}20` : "transparent", color: games === g ? GOLD : "var(--color-text-secondary)", cursor: winner ? "pointer" : "not-allowed", fontWeight: games === g ? 700 : 400, textAlign: "center" }}>
            {g}
          </button>
        ))}
      </div>
      {winner && (
        <div style={{ marginTop: 8, textAlign: "center", padding: "8px 10px", borderRadius: 8, background: `${GOLD}12`, border: `1px solid ${GOLD}40`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center" }}>Champion</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4, textAlign: "center" }}>
            <Logo id={winner.id} size={24} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "'Barlow Condensed',sans-serif", textAlign: "center" }}>{winner.name}</span>
          </div>
          {games && <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", marginTop: 2, textAlign: "center" }}>in {games} games</div>}
        </div>
      )}
    </div>
  );
}

// ── page 3: final bracket (dark, export-ready) ────────────────────────────────

function FinalMatchupCard({ top, bot, result, acc, boxWidth }) {
  const winner = result?.winner;
  const games = result?.games;
  return (
    <div style={{ border: `1.5px solid ${acc}30`, borderRadius: 10, background: "#fff", marginBottom: 7, boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)", minWidth: boxWidth ? boxWidth : 180 }}>
      {[top, bot].map((team, idx) => {
        const isWin = winner?.id === team?.id;
        const isLose = winner && team && winner.id !== team.id;
        return (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: isWin ? `${acc}10` : "#fff", borderBottom: idx === 0 ? `1px solid ${acc}10` : "none", opacity: isLose ? 0.45 : 1, minHeight: 32, textAlign: "left", borderRadius: idx === 0 ? "10px 10px 0 0" : "0 0 10px 10px" }}>
            {!team ? <div style={{ height: 16, flex: 1, borderRadius: 2, background: "#f7f7fa" }} /> : (
              <>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", background: acc, borderRadius: 8, padding: "2px 8px", marginRight: 8, minWidth: 28, display: "inline-block", textAlign: "center", letterSpacing: "0.03em" }}>#{team.seed}</span>
                <Logo id={team.id} size={18} />
                <span style={{ fontSize: 13, fontWeight: 800, color: isWin ? acc : "#222", marginLeft: 8, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left", fontFamily: "'Barlow Condensed',sans-serif" }}>{team.name}</span>
                {isWin && result?.games && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: acc, marginLeft: 10, letterSpacing: "0.01em" }}>{result.games} <span style={{ fontWeight: 400, fontSize: 11, color: acc }}>Games</span></span>
                )}
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

  // Calculate max width for each round's team names
  const getMaxWidth = (matchups) => {
    let max = 0;
    matchups.forEach(({ top, bot }) => {
      [top, bot].forEach((team) => {
        if (team && team.name) {
          const len = team.name.length;
          if (len > max) max = len;
        }
      });
    });
    // Estimate width: 8px per char + 60px for seed/logo/padding
    return max > 0 ? max * 8 + 60 : 120;
  };

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ textAlign: mirrored ? "right" : "left", marginBottom: 12, paddingBottom: 6, borderBottom: `3px solid ${acc}` }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: acc, letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'Barlow Condensed',sans-serif" }}>{label}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {ordered.map((round, roundIdx) => {
          const boxWidth = getMaxWidth(round.matchups);
          return (
            <div key={round.key} style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, letterSpacing: "0.11em", textTransform: "uppercase", color: acc, marginBottom: 10, paddingBottom: 4, borderBottom: `2px solid ${acc}30`, fontFamily: "'Barlow Condensed',sans-serif" }}>{round.label}</div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", flex: 1, gap: 8, minHeight: 260 }}>
                {round.matchups.map((m, i) => <FinalMatchupCard key={i} top={m.top} bot={m.bot} result={round.results[i]} acc={acc} boxWidth={boxWidth} />)}
              </div>
            </div>
          );
        })}
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
    <div style={{ background: "#fff", color: "#222", padding: "24px 20px 20px", borderRadius: 14, fontFamily: "'Barlow Condensed',sans-serif", boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)", textAlign: "center" }}>
      {/* header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1a1a1a", fontFamily: "'Barlow Condensed',sans-serif" }}>WHL PLAYOFF PREDICTIONS</div>
        <div style={{ fontSize: 18, color: "#888", letterSpacing: "0.1em", marginTop: 2, fontWeight: 700 }}>2025–26 SEASON</div>
      </div>

      {/* bracket */}
      <div style={{ display: "flex", gap: 0, alignItems: "flex-start", justifyContent: "center" }}>
        {/* West: R1→R2→R3 */}
        <FinalConferenceSide label="Western Conference" acc={WEST_CLR}
          seeds={westSeeds} r1res={bracketState.western.r1 || []} r2res={bracketState.western.r2 || []} r3res={bracketState.western.r3 || []} mirrored={false} />

        {/* Center championship */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 320, maxWidth: 340, padding: "0 24px", alignSelf: "center", margin: "0 32px" }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.13em", color: GOLD, textAlign: "center", marginBottom: 4, textTransform: "uppercase", fontFamily: "'Barlow Condensed',sans-serif" }}>WHL CHAMPIONSHIP</div>
          <div style={{ fontSize: 14, color: "#888", marginBottom: 18, textAlign: "center", fontWeight: 700 }}>Ed Chynoweth Cup</div>

          <div style={{ border: `3px solid ${GOLD}`, borderRadius: 16, background: "#fffbe6", padding: 18, marginBottom: 18, minWidth: 260, maxWidth: 320, textAlign: "center", fontFamily: "'Barlow Condensed',sans-serif" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 15, color: GOLD, fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>West</span>
              {westChamp && <Logo id={westChamp.id} size={28} />}
              <span style={{ fontSize: 20, fontWeight: 900, color: GOLD, marginLeft: 8 }}>🏆</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#222", textTransform: "uppercase", marginBottom: 4 }}>{westChamp ? westChamp.name : "TBD"}</div>
            {champ && champ.id === westChamp?.id && champ.games && (
              <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginTop: 2 }}>{champ.games} Games</div>
            )}
          </div>

          <div style={{ fontSize: 32, color: GOLD, margin: "-10px 0 0 0" }}>🏆</div>

          <div style={{ border: `3px solid #eee`, borderRadius: 16, background: "#f7f7fa", padding: 18, marginBottom: 18, minWidth: 260, maxWidth: 320, textAlign: "center", fontFamily: "'Barlow Condensed',sans-serif", opacity: eastChamp ? 1 : 0.5 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 15, color: EAST_CLR, fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>East</span>
              {eastChamp && <Logo id={eastChamp.id} size={28} />}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#222", textTransform: "uppercase", marginBottom: 4 }}>{eastChamp ? eastChamp.name : "TBD"}</div>
            {champ && champ.id === eastChamp?.id && champ.games && (
              <div style={{ fontSize: 16, fontWeight: 700, color: EAST_CLR, marginTop: 2 }}>{champ.games} Games</div>
            )}
          </div>

          {champ && (
            <div style={{ marginTop: 18, textAlign: "center", padding: "18px 18px", borderRadius: 18, background: `${GOLD}14`, border: `3px solid ${GOLD}`, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 20, color: GOLD, fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase", textAlign: "center" }}>🏆 WHL CHAMPION</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 8, textAlign: "center" }}>
                <Logo id={champ.id} size={44} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#1a1a1a", textAlign: "center", textTransform: "uppercase" }}>{champ.name}</div>
                  {champ.games && <div style={{ fontSize: 18, color: GOLD, textAlign: "center", fontWeight: 700, marginTop: 2 }}>{champ.games} Games</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* East: R3←R2←R1 (mirrored) */}
        <FinalConferenceSide label="Eastern Conference" acc={EAST_CLR}
          seeds={eastSeeds} r1res={bracketState.eastern.r1 || []} r2res={bracketState.eastern.r2 || []} r3res={bracketState.eastern.r3 || []} mirrored={true} />
      </div>

      <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#bbb", letterSpacing: "0.09em", fontWeight: 700 }}>
        WHL PLAYOFF PREDICTOR • whl.ca
      </div>
    </div>
  );
}

// ── export helper ─────────────────────────────────────────────────────────────

async function exportEl(ref) {
  if (!ref.current) return;
  // Wait for all images inside the export area to load
  const images = Array.from(ref.current.querySelectorAll('img'));
  await Promise.all(images.map(img => {
    if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = img.onerror = () => resolve();
    });
  }));

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

  // Restore full bracket UI
  return (
    <div className="App">
      {page === "select" && (
        <div className="bracket-container" style={{ padding: "0 32px", boxSizing: "border-box", width: "100%", maxWidth: 1200, margin: "0 auto" }}>
          <div className="bracket-header" style={{ textAlign: "center", width: "100%" }}>
            <h1 style={{ textAlign: "center", fontSize: 36, fontWeight: 900, letterSpacing: "0.06em", marginBottom: 8 }}>WHL Playoff Bracket Predictor</h1>
            <p style={{ textAlign: "center", fontSize: 18, color: "#444", fontWeight: 600, marginTop: 0, marginBottom: 24 }}>Select 8 teams per conference and assign seeds to begin.</p>
          </div>
          <div style={{ display: "flex", gap: 48, justifyContent: "center", alignItems: "flex-start", marginBottom: 32, width: "100%" }}>
            <div style={{ flex: 1, maxWidth: 420 }}>
              <TeamSelector conference="western" selected={westSel} onToggle={toggle} onSeed={seed} />
            </div>
            <div style={{ flex: 1, maxWidth: 420 }}>
              <TeamSelector conference="eastern" selected={eastSel} onToggle={toggle} onSeed={seed} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <button
              disabled={!canProceed}
              style={{ fontSize: 16, padding: "10px 32px", borderRadius: 8, background: canProceed ? "#1a3a6e" : "#bbb", color: "#fff", border: "none", fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed", marginTop: 16 }}
              onClick={() => setPage("bracket")}
            >
              Continue to Bracket
            </button>
          </div>
        </div>
      )}
      {page === "bracket" && (
        <div className="bracket-container" style={{ padding: "0 32px", boxSizing: "border-box", width: "100%", maxWidth: 1400, margin: "0 auto" }}>
          <div className="bracket-header" style={{ textAlign: "center", width: "100%" }}>
            <h1 style={{ textAlign: "center", fontSize: 36, fontWeight: 900, letterSpacing: "0.06em", marginBottom: 8 }}>WHL Playoff Bracket Predictor</h1>
            <button style={{ margin: 12, fontSize: 14, display: "block", marginLeft: "auto", marginRight: "auto" }} onClick={() => setPage("select")}>Back to Team Selection</button>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start", justifyContent: "center", width: "100%" }}>
            <BracketSide
              seeds={westSel}
              conference="western"
              bracketState={bracket.western}
              onBracketChange={updateBracket}
            />
            <CenterChampionship
              eastChamp={eastChamp}
              westChamp={westChamp}
              result={bracket.finals}
              onResult={(r) => setBracket((prev) => ({ ...prev, finals: r }))}
            />
            <BracketSide
              seeds={eastSel}
              conference="eastern"
              bracketState={bracket.eastern}
              onBracketChange={updateBracket}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <button
              style={{ fontSize: 16, padding: "10px 32px", borderRadius: 8, background: "#c99600", color: "#222", border: "none", fontWeight: 700, cursor: "pointer", marginTop: 32 }}
              onClick={() => setPage("final")}
            >
              Export Final Bracket
            </button>
          </div>
        </div>
      )}
      {page === "final" && (
        <div className="bracket-container" style={{ background: "#0d1226", minHeight: "100vh", padding: 0, width: "100vw", overflowX: "auto" }}>
          <div className="bracket-header" style={{ color: "#fff", paddingTop: 32, textAlign: "center", width: "100%" }}>
            <h1 style={{ textAlign: "center" }}>Export Bracket</h1>
            <button style={{ margin: 12, fontSize: 14, display: "block", marginLeft: "auto", marginRight: "auto" }} onClick={() => setPage("bracket")}>Back to Bracket</button>
          </div>
          <div ref={finalRef} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 600, padding: 24, width: "100%", overflowX: "auto" }}>
            <FinalBracketView westSeeds={westSel} eastSeeds={eastSel} bracketState={bracket} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <button
              style={{ fontSize: 16, padding: "10px 32px", borderRadius: 8, background: exporting ? "#bbb" : "#c99600", color: "#222", border: "none", fontWeight: 700, cursor: exporting ? "not-allowed" : "pointer", marginTop: 32 }}
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Download PNG"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


