const UserModel = require("./users.model");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {
  Types: { ObjectId },
} = require("mongoose");

class UserController {
  async registerUser(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const createdUser = await UserModel.findOne({ email });

      if (createdUser) {
        return res.status(400).send({ message: "Email in use" });
      }

      const hashPassword = await bcrypt.hash(password, 5);

      await UserModel.create({
        name,
        email,
        password: hashPassword,
        subscription: "free",
      });

      return res.status(201).send({ user: { name, email } });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.find({ email });
      if (!user) {
        return res.status(401).send({ message: "Email or password is wrong" });
      }

      const isPasswordValid = await bcrypt.compare(password, user[0].password);

      if (!isPasswordValid) {
        return res.status(401).send({ message: "Email or password is wrong" });
      }

      const token = await jwt.sign(
        { id: user[0].id, email: user[0].email },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const updatedUser = await UserModel.findByIdAndUpdate(
        user[0].id,
        { token },
        { new: true }
      );
      return res
        .status(200)
        .send(UserController.validateUserResponce([updatedUser]));
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const name = req.query.name;

      console.log(req.user);
      const users = await UserModel.find();
      return res.send(UserController.validateUserResponce(users));
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization") || "";

      let token;
      if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1];
      }
      // console.log(authorizationHeader);
      let userId;
      try {
        userId = await jwt.verify(token, process.env.TOKEN_SECRET).id;
        console.log(userId);
      } catch (err) {
        next(err);
      }

      const user = await UserModel.findById(userId);

      if (!user || user.token !== token) {
        return res.status(401).send({ message: "Not authorized" });
      }

      req.user = UserController.validateUserResponce([user]);
      next();
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const user = req.user;
      console.log(user);
      return res.status(200).send(user[0]);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      console.log(req.user);
      await UserModel.findByIdAndUpdate(
        req.user[0].id,
        {
          token: null,
        },
        { new: true }
      );
      return res.status(204).send({ message: "No Content" });
    } catch (err) {
      next(err);
    }
  }

  validateUserRegister(req, res, next) {
    const rulesSchema = Joi.object({
      name: Joi.string(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      subscription: Joi.string(),
    });
    UserController.checkValidationError(rulesSchema, req, res, next);
  }

  validateUserLogin(req, res, next) {
    const rulesSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    UserController.checkValidationError(rulesSchema, req, res, next);
  }

  static validateUserResponce(users) {
    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription: "free",
        token: user.token,
      };
    });
  }

  static checkValidationError(schema, req, res, next) {
    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .send({ message: "Ошибка от Joi или другой валидационной библиотеки" });
    }
    next();
  }
}

module.exports = new UserController();
