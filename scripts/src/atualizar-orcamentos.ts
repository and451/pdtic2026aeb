import { config } from "dotenv";
config({ path: "../.env" });

import { pool } from "@workspace/db";

const UPDATES_ATENDIDAS: Array<{ titulo: string; planejado: number; realizado: number }> = [
  // N.01  PDTIC Tab.16 preponderante (Word: 1.881.275,88)
  { titulo: "%Service Desk%", planejado: 1725256.01, realizado: 1725256.01 },
  // N.04
  { titulo: "%Office 365%", planejado: 589921.68, realizado: 589921.68 },
  // N.05
  { titulo: "%solução de nuvem%", planejado: 4161589.00, realizado: 4161589.00 },
  // N.06  PDTIC Tab.16 preponderante (Word: 170.000,00)
  { titulo: "%proteção de rede firewall%", planejado: 85000.00, realizado: 85000.00 },
  // N.07  PDTIC Tab.16 preponderante (Word: 4.161.589,00 → mantido só na N.05)
  { titulo: "%Solução de Backup%", planejado: 186768.00, realizado: 186768.00 },
  // N.08  PDTIC Tab.14 preponderante (Word: 604.800,00)
  { titulo: "%telefonia fixa%", planejado: 241920.00, realizado: 241920.00 },
  // N.10
  { titulo: "%Inteligência e Análise de Dados%", planejado: 4153700.00, realizado: 4153700.00 },
  // N.11
  { titulo: "%salas de reunião%", planejado: 80382.32, realizado: 80382.32 },
  // N.13
  { titulo: "%autodesk%", planejado: 432290.69, realizado: 432290.69 },
  // N.14
  { titulo: "%Ferramentas Adobe%", planejado: 516960.00, realizado: 516960.00 },
  // N.17  PDTIC Tab.16 preponderante (Word: 763.426,40)
  { titulo: "%sala segura%", planejado: 390112.75, realizado: 390112.75 },
  // N.18
  { titulo: "%servidores do DataCenter%", planejado: 238710.90, realizado: 238710.90 },
  // N.22  PDTIC Tab.16 preponderante (Word: 296.801,56)
  { titulo: "%Certificados Digitais%", planejado: 382624.32, realizado: 382624.32 },
  // N.26
  { titulo: "Singular", planejado: 574668.00, realizado: 574668.00 },
  // N.28
  { titulo: "%Banco de Preços%", planejado: 43460.00, realizado: 43460.00 },
  // N.29
  { titulo: "%Gestão por Competências%", planejado: 43680.00, realizado: 43680.00 },
  // N.31  PDTIC Tab.15 preponderante (Word: 41.586,10)
  { titulo: "%Intranet%", planejado: 39466.93, realizado: 39466.93 },
  // N.36
  { titulo: "%Monitor Curvo%", planejado: 179900.00, realizado: 179900.00 },
  // N.40
  { titulo: "%Power BI%", planejado: 28864.00, realizado: 28864.00 },
  // N.45
  { titulo: "%Notebook com placa%", planejado: 659900.00, realizado: 659900.00 },
  // N.52
  { titulo: "%conversor de arquivos%", planejado: 5250.00, realizado: 5250.00 },
  // N.51  PDTIC Tab.15 (sem valor no Word)
  { titulo: "%Gestão de Riscos%", planejado: 2425000.00, realizado: 2425000.00 },
];

const UPDATES_ANDAMENTO: Array<{ titulo: string; planejado: number }> = [
  // N.43  PDTIC Tab.16 preponderante (Word: 296.801,56)
  { titulo: "%manutenção de banco de dados%", planejado: 382624.32 },
];

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Atualizando necessidades ATENDIDAS...\n");
    for (const u of UPDATES_ATENDIDAS) {
      const res = await client.query(
        "UPDATE necessidades SET orcamento_planejado = $1, orcamento_realizado = $2 WHERE titulo ILIKE $3 RETURNING id, titulo",
        [u.planejado, u.realizado, u.titulo]
      );
      if (res.rowCount && res.rowCount > 0) {
        console.log(`  OK  id=${res.rows[0].id}  ${res.rows[0].titulo}`);
        console.log(`      orcamento_planejado = ${u.planejado}  |  orcamento_realizado = ${u.realizado}`);
      } else {
        console.log(`  SKIP (título não encontrado)  ILIKE '${u.titulo}'`);
      }
    }

    console.log("\nAtualizando necessidades EM ANDAMENTO...\n");
    for (const u of UPDATES_ANDAMENTO) {
      const res = await client.query(
        "UPDATE necessidades SET orcamento_planejado = $1, orcamento_realizado = NULL WHERE titulo ILIKE $2 RETURNING id, titulo",
        [u.planejado, u.titulo]
      );
      if (res.rowCount && res.rowCount > 0) {
        console.log(`  OK  id=${res.rows[0].id}  ${res.rows[0].titulo}`);
        console.log(`      orcamento_planejado = ${u.planejado}  |  orcamento_realizado = NULL`);
      } else {
        console.log(`  SKIP (título não encontrado)  ILIKE '${u.titulo}'`);
      }
    }

    console.log("\nConferência: valores atualizados\n");
    const rows = await client.query(
      "SELECT id, titulo, orcamento_planejado, orcamento_realizado, status FROM necessidades ORDER BY id"
    );
    for (const r of rows.rows) {
      const op = r.orcamento_planejado ? `R$ ${Number(r.orcamento_planejado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—";
      const or = r.orcamento_realizado ? `R$ ${Number(r.orcamento_realizado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—";
      console.log(`  id=${r.id} | ${r.titulo.substring(0, 55).padEnd(55)} | OP=${op.padStart(18)} | OR=${or.padStart(18)} | ${r.status}`);
    }

    console.log("\n✅ Transação finalizada. Confira os valores acima.");
    console.log("   Para confirmar (COMMIT), digite 'commit' e pressione Enter.");
    console.log("   Para desfazer (ROLLBACK), digite 'rollback' e pressione Enter.");

    const answer = await new Promise<string>((resolve) => {
      process.stdin.once("data", (data) => resolve(data.toString().trim().toLowerCase()));
    });

    if (answer === "commit") {
      await client.query("COMMIT");
      console.log("\n✅ COMMIT realizado. Alterações salvas no banco.");
    } else {
      await client.query("ROLLBACK");
      console.log("\n❌ ROLLBACK realizado. Nenhuma alteração foi salva.");
    }
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("\n❌ Erro:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    process.stdin.end();
  }
}

run();
