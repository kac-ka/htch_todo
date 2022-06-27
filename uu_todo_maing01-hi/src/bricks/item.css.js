import Config from "./config/config";

const itemDiv = () => Config.Css.css`
  background-color: #E0E0E0;
  display: inline-flex; 
  height: 60px;
  width: 100%;
  justify-content: space-between; 
  margin: 10px 0;
  align-items: center;
  border-radius: 4px;
`;

const item = () => Config.Css.css`
  display: flex; 
  height: 40px;
  width: 100%;
  justify-content: flex-start; 
  align-items: center;
`;

const itemText = (dynamicCss) => Config.Css.css`
  text-decoration: ${dynamicCss.strike};
  color: ${dynamicCss.color};
`;

const stateCheck = () => Config.Css.css`
 margin-top: 0;
`;

export default {
  itemDiv,
  item,
  itemText,
  stateCheck,
};
