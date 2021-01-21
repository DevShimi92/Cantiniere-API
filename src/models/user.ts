import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

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


