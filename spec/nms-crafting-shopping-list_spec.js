// spec
var it, expect, describe, searchForComponent, getComponentTree, filterOnRawMaterials;

describe ("NMS Crafting Shopping List", () => {

  describe('searchForComponent', () => {

    let stasisDevice = searchForComponent('Stasis Device');

    it('should find a component by name, in the crafting data', ()=> {
      expect(stasisDevice).toEqual({
        name: 'Stasis Device',
        value: 15600000,
        resources: [
          {name:"Quantum Processor",qty: 1},
          {name:"Cryogenic Chamber",qty: 1},
          {name:"Iridesite",qty: 1}
        ]
      });
    });
  });

  describe('filters', ()=> {
    let resources = [
      {name: "Statis Device"},
      {name: "Gold"},
      {name: "Living Glass"},
      {name: "Lubricant"},
      {name: "Carbon"},
      {name: "Condensed Carbon"}
    ];

    describe('filterOnRawMaterials', () => {
      it('should return only raw materials', ()=> {
        let filtered = filterOnRawMaterials(resources);
        expect(filtered).toEqual([
          {name: "Gold"},
          {name: "Carbon"},
          {name: "Condensed Carbon"}
        ]);
      });
    });

    describe('filterOnCraftable', () => {
     it('should return only craftable resources', ()=> {
        let filtered = filterOnCraftable(resources);
        expect(filtered).toEqual([
          {name: "Statis Device"},
          {name: "Living Glass"},
          {name: "Lubricant"}
        ]);
      });
     });
  });

  describe('getComponentTree', () => {
    describe('building component tree', ()=> {

      it('should create a new object tree for the component', ()=> {
        let component = searchForComponent('Living Glass');
        let component_tree = getComponentTree(component);

        expect(component).not.toBe(component_tree); // not a reference!
        expect(component_tree.name).toEqual('Living Glass');
        expect(component_tree.value).toEqual(566000);
      });

      it('should provide a list of craftable componentns separate from raw materials', ()=> {
        let component = searchForComponent('AtlasPass v2');
        let component_tree = getComponentTree(component);

        expect(component_tree.craftable).toBeDefined();
        expect(component_tree.rawMaterials).toBeDefined();

        expect(component_tree.craftable.map(r => r.name )).toEqual([
          "Microprocessor"
        ]);

        expect(component_tree.rawMaterials.map(r => r.name)).toEqual([
          "Cadmium",
        ]);
      });

      it('should calculate the cost of craftable components', () => {
        let component = searchForComponent('Living Glass');
        let component_tree = getComponentTree(component);

        expect(component_tree.craftable[0].name).toEqual('Glass');
        expect(component_tree.craftable[0].qty).toEqual(5);
        expect(component_tree.craftable[0].cost).toEqual(5 * 200);
      });

      it('should calculate the cost of raw materials', () => {
        let component = searchForComponent('AtlasPass v2');
        let component_tree = getComponentTree(component);

        expect(component_tree.craftable[0].name).toEqual('Microprocessor');
        expect(component_tree.craftable[0].qty).toEqual(1);
        expect(component_tree.craftable[0].cost).toEqual(1 * 2000);
      });

      xit('should collect all craftable and raw materials required for the component', ()=> {
        let component = searchForComponent('AtlasPass v2');
        let component_tree = getComponentTree(component);

        expect(component_tree.craftable[0].resources).toBeDefined();
      });

    });
  });
});
