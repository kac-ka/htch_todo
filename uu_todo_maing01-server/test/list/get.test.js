const { TestHelper } = require("uu_appg01_server-test");
const testHelper = require("uu_appg01_server-test/src/test-helper");
const { hasUncaughtExceptionCaptureCallback } = require("process");

beforeEach(async () => {
    await TestHelper.setup();
    await TestHelper.initUuSubAppInstance();
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
    await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  });
  
  afterEach(async () => {
    await TestHelper.teardown();
  });

  describe("List/get_tests", () => {
    //expect.assertions(4);
    test("HDS1", async () =>{
        let session = await TestHelper.login("AllUser");
        let dbList = {
            name: "Test name",
        }
        let dbResult = await TestHelper.executePostCommand("list/create", dbList, session);
        let dtoIn = { 
            id: dbResult.id
    };
    let result = await TestHelper.executeGetCommand("list/get", dtoIn , session);
    expect(result.status).toEqual(200);
    expect(result.name).toEqual(dbList.name);
    expect(result.visibility).toBeTruthy();
    expect(result.uuAppErrorMap).toEqual({});
    });
  })