import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

const filePath = path.resolve("clientes.json");
const productsPath = path.resolve("products.json");
const pedidoVendaTempPath = path.resolve("pedido_venda_temp.json");

//clientes

function readCustomers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }

  const file = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(file);
}

function saveCustomers(customers: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(customers, null, 2));
}

app.get("/clientes", (req, res) => {
  const customers = readCustomers();

  res.json(customers);
});

app.post("/clientes", (req, res) => {
  const customers = readCustomers();

  const newCustomer = {
    CodCliente: Date.now(),
    ...req.body,
  };

  customers.push(newCustomer);

  saveCustomers(customers);

  res.status(201).json(newCustomer);
});

app.post("/clientes/importar", (req, res) => {
  const importedCustomers = req.body;

  if (!Array.isArray(importedCustomers)) {
    return res.status(400).json({
      error: "Formato inválido",
    });
  }

  saveCustomers(importedCustomers);

  res.json({
    success: true,
    total: importedCustomers.length,
  });
});

//produtos

function readProducts() {
  if (!fs.existsSync(productsPath)) {
    fs.writeFileSync(productsPath, "[]");
  }

  const file = fs.readFileSync(productsPath, "utf-8");

  return JSON.parse(file);
}

function saveProducts(products: any[]) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

function readOrders() {
  if (!fs.existsSync(pedidoVendaTempPath)) {
    fs.writeFileSync(pedidoVendaTempPath, "[]");
  }

  return JSON.parse(fs.readFileSync(pedidoVendaTempPath, "utf-8"));
}

function saveOrders(orders: any[]) {
  fs.writeFileSync(pedidoVendaTempPath, JSON.stringify(orders, null, 2));
}

app.get("/produtos", (req, res) => {
  const products = readProducts();

  res.json(products);
});

app.get("/produtos/:codigo", (req, res) => {
  const products = readProducts();

  const product = products.find((p: any) => p.Codigo === req.params.codigo);

  if (!product) {
    return res.status(404).json({
      error: "Produto não encontrado",
    });
  }

  res.json(product);
});

app.post("/produtos", (req, res) => {
  const products = readProducts();

  products.push(req.body);

  saveProducts(products);

  res.status(201).json(req.body);
});

app.get("/pedidos", (req, res) => {
  const orders = readOrders();

  res.json(orders);
});

app.post("/pedidos", (req, res) => {
  const orders = readOrders();

  const newOrder = {
    Pedido: Date.now(),
    createdAt: new Date().toISOString(),
    ...req.body,
  };

  orders.push(newOrder);

  saveOrders(orders);

  res.status(201).json(newOrder);
});

//pedido-venda

function readPedidoVendaTemp() {
  if (!fs.existsSync("pedido_venda_temp.json")) {
    fs.writeFileSync("pedido_venda_temp.json", "[]");
  }

  return JSON.parse(fs.readFileSync("pedido_venda_temp.json", "utf-8"));
}

function savePedidoVendaTemp(data: any) {
  fs.writeFileSync("pedido_venda_temp.json", JSON.stringify(data, null, 2));
}

app.get("/Pedido_VendaTemp", (req, res) => {
  const pedidos = readPedidoVendaTemp();

  res.json(pedidos);
});

app.post("/Pedido_VendaTemp", (req, res) => {
  const pedidos = readPedidoVendaTemp();

  pedidos.push(req.body);

  savePedidoVendaTemp(pedidos);

  res.status(201).json(req.body);
});

//consignados

// function readConsigned() {
//   if (!fs.existsSync(consignedPath)) {
//     fs.writeFileSync(consignedPath, "[]");
//   }

//   const file = fs.readFileSync(consignedPath, "utf-8");

//   return JSON.parse(file);
// }

// function saveConsigned(consigned: any[]) {
//   fs.writeFileSync(consignedPath, JSON.stringify(consigned, null, 2));
// }

// app.post("/consignados", (req, res) => {
//   const consignados = readConsigned();

//   consignados.push(req.body);

//   saveConsigned(consignados);

//   res.status(201).json(req.body);
// });

// app.get("/consignados/:CodCliente", (req, res) => {
//   const consignados = readConsigned();

//   console.log(consignados);
//   console.log(req.params.CodCliente);

//   const items = consignados.filter(
//     (c: any) => c.CodCliente == req.params.CodCliente,
//   );

//   res.json(items);
// });

app.listen(3333, () => {
  console.log("Servidor rodando 🚀");
});
