import { Model, DataTypes } from "sequelize";
import { database } from "../config/database";

export interface UserInterface {
    id: number;
    name: string;
  }
  
  
  export class User extends Model {
    public id!: number; 
    public name!: string;
  
    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;


  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
    },
    {
      tableName: "users",
      sequelize: database , 
    }
  );


