import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { log } from "../config/log_config";

export interface UserInterface {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    money: number;
    cooker: boolean;
  }
  
  
  export class User extends Model {
    public id!: number; 
    public first_name!: string;
    public last_name!: string;
    public email!: string;
    public password!: string;
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
  }).then(function(data) {
    if(data.length == 0)
        {
          log.warn('Compte admin non trouvé, création du compte....');
          User.create({ first_name: 'Cantiniere', last_name: 'Responsable', email: process.env.COOKER_DEFAUT_EMAIL, password: process.env.COOKER_DEFAUT_PASSWORD, cooker: true });
          log.warn('Compte admin crée');
        }
  });
  
  




