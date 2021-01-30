import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface OrderContentInterface {
    id_order: number;
    id_article: number;
    price: number;
    origin_price: number;
    discout: number;
  }
  
  
export class OrderContent extends Model {
    public id_order!: number;
    public id_article!: number;
    public price!: number;
    public origin_price!: number;
    public discout!: number;
  }

  OrderContent.init(
    {
      id_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_article: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      origin_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      discout: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      tableName: "order_content",
      sequelize: sequelize , 
      timestamps: false
    }
  );