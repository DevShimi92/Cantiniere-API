import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { OrderContent } from "./order_content";

export interface OrderInfoInterface {
    id: number;
    id_client: number;
    sold_before_order: number;
    total: number;
    done: boolean;
  }
  
  
export class OrderInfo extends Model {
    public id!: number;
    public id_client!: number;
    public sold_before_order!: number;
    public total!: number;
    public done!: boolean;

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
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "order_info",
      sequelize: sequelize , 
      updatedAt: false
    }
  );

  OrderInfo.hasMany(OrderContent, {
    sourceKey: "id",
    foreignKey: "id_order",
    onDelete: "CASCADE"
  });

  OrderContent.belongsTo(OrderInfo, {
    foreignKey: {
      name: 'id_order'
    }
  });