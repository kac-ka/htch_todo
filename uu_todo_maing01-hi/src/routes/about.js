//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useLsi } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import AboutCfg from "../config/about.js";
//@@viewOff:imports

// see "About" route pattern guideline: https://uuapp.plus4u.net/uu-bookkit-maing01/0238a88bac124b3ca828835b57144ffa/book/page?code=64bcc363

const PRODUCTS = [
  {
    baseUri: "https://uuapp.plus4u.net/uu-bookkit-maing01/e884539c8511447a977c7ff070e7f2cf",
    name: "uuAppDevKit - User Guide (replace\xa0these)",
    tags: [],
  },
  {
    baseUri: "https://uuapp.plus4u.net/uu-bookkit-maing01/2590bf997d264d959b9d6a88ee1d0ff5",
    tags: [],
  },
];
const UU_FLS_URI = undefined;
const UU_SLS_URI = undefined;
const PRODUCT_PORTAL_URI = undefined;

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "About",
  //@@viewOff:statics
};

const CLASS_NAMES = {
  main: () => Config.Css.css`
    margin: 0 auto;
    max-width: 920px;

    .plus4u5-app-about > .uu5-bricks-header,
    .plus4u5-app-licence > .uu5-bricks-header,
    .plus4u5-app-authors > .uu5-bricks-header,
    .plus4u5-app-technologies > .uu5-bricks-header {
      border-bottom: 0;
    }

    .plus4u5-app-authors > .uu5-bricks-header {
      margin: 20px 0 10px 0;
      text-align: center;
    }

    > *:last-child {
      padding-bottom: 56px;
    }
  `,
  technologies: () => Config.Css.css`
    max-width: 480px;
  `,
  logos: () => Config.Css.css`
    text-align:center;
    margin-top: 56px;

    .uu5-bricks-image {
      height: 80px;
    }
  `,
  common: () => Config.Css.css`
    max-width: 480px;
    margin: 12px auto 56px;
  
    & > .uu5-common-div {
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      padding: 9px 0 12px;
      text-align: center;
      color: #828282;
      &:last-child {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
    }
  `,
  technologiesLicenseRow: () => Config.Css.css`
    margin-top: 40px;
    border-top: 1px solid rgba(0,0,0,.12);
  `,
  license: () => Config.Css.css`
    width: auto;
  `,
};

export const About = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const aboutLsi = AboutCfg.about || {};
    const licence = AboutCfg.licence || {};
    const usedTechnologies = AboutCfg.usedTechnologies || {};
    const { awid } = Plus4U5.Common.Tools.getAppInfo();

    // NOTE Some of these cannot be passed as prop={<UU5.Bricks.Lsi />} therefore we're using useLsi() hook.
    const about = useLsi(aboutLsi);
    const organisation = useLsi(licence.organisation);
    const authorities = useLsi(licence.authorities);
    const technologies = useLsi(usedTechnologies.technologies);
    const content = useLsi(usedTechnologies.content);

    const header = useLsi(Lsi.about.header);
    const creatorsHeader = useLsi(Lsi.about.creatorsHeader);
    const termsOfUse = useLsi(Lsi.about.termsOfUse);
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    function getAuthors(authors) {
      return (
        authors &&
        authors.slice().map((author) => {
          author = UU5.Common.Tools.merge({}, author);
          author.role =
            author.role && typeof author.role === "object" ? <UU5.Bricks.Lsi lsi={author.role} /> : author.role;
          // author.src =
          //   author.src || Calls.getCommandUri("getAppAuthorPhoto", { uuIdentity: author.uuIdentity }).toString();
          return author;
        })
      );
    }
    const leadingAuthors = getAuthors(AboutCfg.leadingAuthors);
    const otherAuthors = getAuthors(AboutCfg.otherAuthors);
    const attrs = UU5.Common.VisualComponent.getAttrs(props, CLASS_NAMES.main());
    return (
      <UU5.Bricks.Section {...attrs}>
        <Plus4U5.App.ArtifactSetter territoryBaseUri="" artifactId="" />

        <Plus4U5.App.About header={header} content={about} />
        <UU5.Bricks.Authenticated authenticated>
          <Plus4U5.App.Support
            uuFlsUri={UU_FLS_URI}
            uuSlsUri={UU_SLS_URI}
            productCode="support/uuTodo"
            productPortalUri={PRODUCT_PORTAL_URI}
          />
        </UU5.Bricks.Authenticated>
        {UU5.Common.Tools.findComponent("UuProductCatalogue.Bricks.ProductList", {
          type: "16x9",
          products: PRODUCTS,
        })}
        <UU5.Bricks.Div className={CLASS_NAMES.common()}>
          <UU5.Bricks.Div content={`uuTodo ${UU5.Environment.appVersion}`} />
          {licence.termsOfUse && (
            <UU5.Bricks.Div>
              <UU5.Bricks.Link href={licence.termsOfUse} target="_blank" content={termsOfUse} />
            </UU5.Bricks.Div>
          )}
        </UU5.Bricks.Div>
        <Plus4U5.App.Authors header={creatorsHeader} leadingAuthors={leadingAuthors} otherAuthors={otherAuthors} />
        <UU5.Bricks.Row className={CLASS_NAMES.technologiesLicenseRow()}>
          <UU5.Bricks.Column colWidth={{ xs: 12, l: 8 }}>
            <Plus4U5.App.Technologies
              technologies={technologies}
              content={content}
              textAlign="left"
              className={CLASS_NAMES.technologies()}
            />
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth={{ xs: 12, l: 4 }}>
            <Plus4U5.App.Licence
              organisation={organisation}
              authorities={authorities}
              awid={<UU5.Bricks.Link href={UU5.Environment.appBaseUri}>{awid}</UU5.Bricks.Link>}
              textAlign="left"
              className={CLASS_NAMES.license()}
            />
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
        <UU5.Bricks.Div className={CLASS_NAMES.logos()}>
          <UU5.Bricks.Image responsive={false} src="assets/plus4u.svg" />
          <UU5.Bricks.Image responsive={false} src="assets/unicorn.svg" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Section>
    );
  },
  //@@viewOff:render
});

export default About;
