import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API funcionando 🚀",
  });
});

app.get("/clientes", (req, res) => {
  res.json(clientes);
});
//a
app.post("/clientes", (req, res) => {
  const { nome, telefone, cidade, documento } = req.body;

  const novoCliente = {
    id: clientes.length + 1,
    nome,
    telefone,
    cidade,
    documento,
  };

  clientes.push(novoCliente);

  res.status(201).json(novoCliente);
});

let clientes = [
  {
    id: 1,
    nome: "Borracharia Central",
    telefone: "(31) 99911-7788",
    cidade: "Betim/MG",
  },
  {
    id: 2,
    nome: "Auto Mecânica Silva",
    telefone: "(31) 98877-1122",
    cidade: "Belo Horizonte/MG",
  },
];

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333 🚀");
});
