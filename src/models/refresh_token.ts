import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user";

export interface RefreshTokenInterface {
    id_client: number;
    token_refresh: string;
  }
  
  
export class RefreshToken extends Model {
    public id_client!: number;
    public tokenRefresh!: string;
  }

  RefreshToken.init(
    {
      id_client: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tokenRefresh: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "refresh_token",
      sequelize: sequelize , 
      timestamps: false
    }
  );

  RefreshToken.belongsTo(User, {
    foreignKey: {
      name: 'id_client'
    },
    targetKey:'id',
    constraints:false
  });