import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { MenuContent } from "./menu_content";
import { OrderContent } from "./order_content";

export interface MenuInfoInterface {
    id: number;
    name: string;
    description: string;
    price_final: number;
  }
  
export class MenuInfo extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public price_final!: number;
  }

  MenuInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: new DataTypes.STRING,
        allowNull: true,
      },
      price_final: {
        type: new DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      tableName: "menu_info",
      sequelize: sequelize , 
      timestamps: false
    }
  );
  
  MenuInfo.hasMany(MenuContent, {
    sourceKey: "id",
    foreignKey: "id_menu",
    onDelete: "CASCADE"
  });

  MenuContent.belongsTo(MenuInfo, {
    foreignKey: {
      name: 'id_menu'
    }
  });

  OrderContent.belongsTo(MenuInfo, {
    foreignKey: {
      name: 'id_menu'
    }
  });