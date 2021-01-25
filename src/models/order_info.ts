import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface OrderInfoInterface {
    id: number;
    id_client: number;
    sold_before_order: number;
    total: number;
  }
  
  
export class OrderInfo extends Model {
    public id!: number;
    public id_client!: number;
    public sold_before_order!: number;
    public total!: number;

    // timestamps
    public readonly createdAt!: Date;
  }

  OrderInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      id_client: {
        type: new DataTypes.INTEGER,
        allowNull: false,
      },
      sold_before_order: {
        type: new DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: new DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "order_info",
      sequelize: sequelize , 
      updatedAt: false
    }
  );
