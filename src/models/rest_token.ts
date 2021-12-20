import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user";

export interface RestTokenInterface {
    id_client: number;
    token_Rest: string;
  }
  
  
export class RestToken extends Model {
    public id_client!: number;
    public token_Rest!: string;
  }

  RestToken.init(
    {
      id_client: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token_Rest: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "rest_token",
      sequelize: sequelize , 
      timestamps: false
    }
  );

  RestToken.belongsTo(User, {
    foreignKey: {
      name: 'id_client'
    },
    targetKey:'id',
    constraints:false
  });