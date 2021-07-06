import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { log } from "../config/log_config";
import bcrypt from "bcrypt";

export interface UserInterface {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    salt:string;
    money: number;
    cooker: boolean;
  }
  
  
  export class User extends Model {
    public id!: number; 
    public first_name!: string;
    public last_name!: string;
    public email!: string;
    public password!: string;
    public salt!: string;
    public money!: number;
    public cooker!: boolean;
  
    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: new DataTypes.STRING(20),
        allowNull: true,
      },
      last_name: {
        type: new DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: new DataTypes.STRING,
        allowNull: true,
      },
      money: {
        type: new DataTypes.FLOAT,
        defaultValue: 0,
      },
      cooker: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "users",
      sequelize: sequelize , 
    }
  );

  User.findAll<User>({
    attributes : ['cooker'],
    raw: true,
    where: {
      cooker: true
    }
  }).then(async function(data) {
    if(data.length == 0 && !process.env.API_TEST)
        {
          log.warn('Compte admin non trouvé, création du compte....');
          let saltRounds = 10 ;
          let salt =  await bcrypt.genSalt(saltRounds);
          let password = process.env.COOKER_DEFAUT_PASSWORD!;
          let hash =  await bcrypt.hash(password,  salt);
          User.create({ first_name: 'Cantiniere', last_name: 'Responsable', email: process.env.COOKER_DEFAUT_EMAIL, password: hash, salt: salt, cooker: true });
          log.warn('Compte admin crée');
        }
  });
  
  




