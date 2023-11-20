import { Socket } from "socket.io";
import {
  NewUser,
  LoginForm,
  NewNature,
  NewRule,
  NewCompany,
} from "../definitions/userOperations";
import { ClientBag } from "../definitions/client";
import databaseHandler from "../databaseHandler";

const prisma = databaseHandler;

const handleLogin = async (socket: Socket, data: LoginForm) => {
  const admin = await databaseHandler.user.loginAdmin(data);
  const customer = await databaseHandler.user.loginCustomer(data);

  if (admin) {
    socket.emit("user:login:success2", admin);
  } else if (customer) {
    socket.emit("user:login:success2", customer);
  } else {
    socket.emit("user:login:failed2", { error: "Credenciais inválidas2." });
  }
};

const handleSignup = async (
  socket: Socket,
  data: NewUser // Change 'any' to 'NewUser' to ensure type safety
) => {
  try {
    databaseHandler.user.create(data);
    // Emit success event
    socket.emit("application:status:review", data);
    socket.broadcast.emit("admin:list:update", data);
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2002" && error.meta) {
      // Mapping field errors to error messages
      const fieldErrorMap: any = {
        username: "The username already exists.",
        email: "The email already exists.",
        cpf: "CPF already registered.",
        rg: "RG already registered.",
        cnpj: "CNPJ already registered.",
        voter_card: "Voter card already registered.",
        work_card: "Work card already exists.",
      };

      // Check which field caused the error
      for (const field in fieldErrorMap) {
        if (error.meta.target.includes(field)) {
          socket.emit("application:status:failed", {
            error: fieldErrorMap[field],
          });
          break;
        }
      }
    }
  }
};

const userList = async (socket: Socket) => {
  try {
    const { admin, customer } = await databaseHandler.user.list();
    socket.emit("user:list", { admin, customer });
  } catch (error) {
    console.error(`Error fetching user list`);
    socket.emit("user:list:error", { error });
  }
};

const customerList = async (socket: Socket) => {
  try {
    const customer = await databaseHandler.user.customerList();
    socket.emit("user:list", customer);
  } catch (error) {
    console.error(`Error fetching customer list`);
    socket.emit("user:list:error", { error });
  }
};

const productList = async (socket: Socket) => {
  try {
    const product = await databaseHandler.product.list();
    socket.emit("product:list", product);
  } catch (error) {
    console.error(`Error fetching product list`);
    socket.emit("user:list:error", { error });
  }
};

const productCreate = async (socket: Socket, data: any) => {
  try {
    const product = await databaseHandler.product.create(data);
    socket.emit("product:create:success", product);
  } catch (error) {
    console.error(`Error creating product`);
    socket.emit("product:create:error", { error });
  }
};

const companyList = async (socket: Socket) => {
  try {
    const company = await databaseHandler.company.list();
    socket.emit("company:list", company);
  } catch (error) {
    console.error(`Error fetching company list`);
    socket.emit("user:list:error", { error });
  }
};

const companyCreate = async (socket: Socket, data: NewCompany) => {
  try {
    const company = await databaseHandler.company.create(data);
    socket.emit("company:create:success", company);
  } catch (error) {
    console.error(`Error creating product`, error);
    socket.emit("product:create:error", { error });
  }
};

const natureList = async (socket: Socket) => {
  try {
    const natures = await databaseHandler.nature.list();
    socket.emit("nature:list", natures);
  } catch (error) {
    console.error(`Error fetching company list`);
    socket.emit("user:list:error", { error });
  }
};

const natureCreate = async (socket: Socket, data: NewNature) => {
  try {
    const natureza = await databaseHandler.nature.create(data);
    socket.emit("nature:success", natureza);
  } catch (error) {
    console.error("Error creating Natureza:", error);
    socket.emit("nature:error", error);
  }
};

const ruleCreate = async (socket: Socket, data: NewRule) => {
  try {
    const natureza = await databaseHandler.rule.create(data);
    socket.emit("rule:success", natureza);
  } catch (error) {
    console.error("Error creating Rule:", error);
    socket.emit("rule:error", error);
  }
};

export default {
  handleLogin,
  handleSignup,
  userList,
  customerList,
  productList,
  productCreate,
  companyList,
  companyCreate,
  natureList,
  natureCreate,
  ruleCreate,
};
