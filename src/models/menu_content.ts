import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface MenuContentInterface {
    id_menu: number;
    id_article: number;
  }
  
  
export class MenuContent extends Model {
    public id_menu!: number;
    public id_article!: number;
  }

  MenuContent.init(
    {
      id_menu: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_article: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "menu_content",
      sequelize: sequelize , 
      timestamps: false
    }
  );