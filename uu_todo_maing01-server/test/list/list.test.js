const { TestHelper } = require("uu_appg01_server-test");

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

  describe("List/list_tests", () => {
    //expect.assertions(4);
    test("HDS1", async () =>{
        let session = await TestHelper.login("AllUser");
        await TestHelper.executePostCommand("list/create", {
            name: "Test name 1",
        }, session);
        await TestHelper.executePostCommand("list/create", {
            name: "Test name 2",
        }, session);
        await TestHelper.executePostCommand("list/create", {
            name: "Test name 3",
        }, session);

    let result = await TestHelper.executeGetCommand("list/list", {} , session);
    expect(result.status).toEqual(200);
    expect(result.pageInfo.total).toEqual(3);
    expect(result.itemList[0].visibility).toBeTruthy();
    expect(result.itemList[0].name).toEqual("Test name 1");
    expect(result.uuAppErrorMap).toEqual({});
    });
  })