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

  describe("List/delete_tests", () => {
    //expect.assertions(4);
    test("HDS1", async () =>{
        let session = await TestHelper.login("AllUser");
        let dbList = {
            name: "Test name",
            };
        let dbResult = await TestHelper.executePostCommand("list/create", dbList, session);
        let dtoIn = { 
            id: dbResult.id
            };
        let result = await TestHelper.executePostCommand("list/delete", dtoIn , session);

        expect(result.status).toEqual(200);
        expect(result.uuAppErrorMap).toEqual({});
    });
    test("AS1", async () =>{
        let session = await TestHelper.login("AllUser");
        let dbList = {
            name: "Test name",
            };
        let dbResult = await TestHelper.executePostCommand("list/create", dbList, session);
        let itemIn = {
            listId: dbResult.id,
            text: "test item"
        }
        await TestHelper.executePostCommand("item/create",itemIn,session)
        let dtoIn = { 
            id: dbResult.id
            };
        let result = await TestHelper.executePostCommand("list/delete", dtoIn , session);

        expect(result.status).toEqual(400);
        expect(result.uuAppErrorMap.length).toEqual(1);
    });
  });