// spec
var it, expect, describe, searchForComponent, getComponentTree, filterOnMinedAndCultivated;

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

    describe('filterOnMinedAndCultivated', () => {
      it('should return only mined and cultivated resources', ()=> {
        let filtered = filterOnMinedAndCultivated(resources);
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
    describe('build object tree', ()=> {

      it('should create a new object tree for the component', ()=> {
        let component = searchForComponent('Living Glass');
        let component_tree = getComponentTree(component);

        expect(component_tree.name).toEqual('Living Glass');
        expect(component_tree.value).toEqual(566000);
        expect(component).not.toBe(component_tree);
      });

      it('should provide a list of craftable componentns separate from mined and cultivated materials', ()=> {
        let component = searchForComponent('Living Glass');
        let component_tree = getComponentTree(component);

        expect(component_tree.craftable).toBeDefined();
        expect(component_tree.minedAndCultivated).toBeDefined();

        expect(component_tree.craftable.map((r)=> r.name )).toEqual([
          "Glass",
          "Lubricant"
        ]);

        expect(component_tree.minedAndCultivated.length).toEqual(0);
      });
    });
  });
});
