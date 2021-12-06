import { Model, DataTypes,Sequelize } from "sequelize";
import { sequelize } from "../config/database";
import { OrderContent } from "./order_content";
import { User } from "./user";

export interface OrderInfoInterface {
    id: number;
    id_client: number;
    date_order : Date;
    sold_before_order: number;
    total: number;
    done: boolean;
  }
  
  
export class OrderInfo extends Model {
    public id!: number;
    public id_client!: number;
    public date_order!: Date;
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
      date_order: {
        type: new DataTypes.DATEONLY,
        defaultValue: Sequelize.fn('now'),
      },
      sold_before_order: {
        type: new DataTypes.FLOAT,
        allowNull: false,
      },
      total: {
        type: new DataTypes.FLOAT,
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

  OrderInfo.belongsTo(User, {
    foreignKey: {
      name: 'id_client'
    },
    targetKey:'id',
    constraints:false
  });