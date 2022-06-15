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

  describe("List/create_tests", () => {
    expect.assertions(5);
    testHelper("HDS1"), async () =>{
        let session = await TestHelper.login("ExecutiveUser");
        let dtoIn = { 
            name: "Test name",
            description: "Some list for toDo something",
            deadline: "2022-07-16"
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn , session);
    expect(result.status).toEqual(200);
    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.description).toEqual(dtoIn.text);
    expect(result.data.deadline).toEqual(dtoIn.deadline);
    expect(result.data.uuAppErrorMap).toEqual({});
    }
  })