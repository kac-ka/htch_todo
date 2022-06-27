import Config from "./config/config";

const listDiv = (dynamicCss) => Config.Css.css`
  display: flex; 
  font-size: 18px;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
  height: 40px;
  width: 100%;
  background-color: ${dynamicCss.bgcolor};
  color: ${dynamicCss.color};
  padding: 30px 15px;
`;

export default {
  listDiv,
  bgColor,
};
