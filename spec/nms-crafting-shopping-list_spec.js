// spec
var it, expect, describe, searchForComponent, buildComponentTree, filterOnRawMaterials;

let example = it;

describe ("No Man's Sky - Crafting Shopping List", () => {

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
      {name: "Condensed Carbon"},
      {name: "Chromatic Metal"}
    ];

    describe('filterOnRawMaterials', () => {
      it('should return only raw materials', ()=> {
        let filtered = filterOnRawMaterials(resources);
        expect(filtered).toEqual([
          {name: "Gold"},
          {name: "Carbon"},
          {name: "Condensed Carbon"},
          {name: "Chromatic Metal"}
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

  describe('buildComponentTree', () => {
    describe('building component tree', ()=> {

      it('should create a new object tree for the component', ()=> {
        let component = 'Living Glass';
        let componentTree = buildComponentTree(component);

        expect(component).not.toBe(componentTree); // not a reference!
        expect(componentTree.name).toEqual('Living Glass');
        expect(componentTree.value).toEqual(566000);
      });

      it('should provide a list of craftable componentns separate from raw materials', ()=> {
        let component = 'AtlasPass v2';
        let componentTree = buildComponentTree(component);

        expect(componentTree.craftable).toBeDefined();
        expect(componentTree.rawMaterials).toBeDefined();

        expect(componentTree.craftable.map(r => r.name )).toEqual([
          "Microprocessor"
        ]);

        expect(componentTree.rawMaterials.map(r => r.name)).toEqual([
          "Cadmium",
        ]);
      });

      it('should calculate the cost of craftable components', () => {
        let component = 'Living Glass';
        let componentTree = buildComponentTree(component);

        expect(componentTree.craftable[0].name).toEqual('Glass');
        expect(componentTree.craftable[0].qty).toEqual(5);
        expect(componentTree.craftable[0].cost).toEqual(5 * 200);
      });

      it('should calculate the cost of raw materials', () => {
        let component = 'Microprocessor';
        let componentTree = buildComponentTree(component);

        expect(componentTree.rawMaterials[0].name).toEqual('Chromatic Metal');
        expect(componentTree.rawMaterials[0].qty).toEqual(40);
        expect(componentTree.rawMaterials[0].cost).toEqual(40 * 245);
      });

      it('Should calculate aggregate raw materials for the component', ()=> {
        let component = 'AtlasPass v2';
        let componentTree = buildComponentTree(component);

        expect(Object.keys(componentTree.aggregatedRawMaterials[0])).toEqual([
          "name",
          "qty",
          "cost"
        ]);

        expect(componentTree.aggregatedRawMaterials.map( i => i.name )).toEqual([
          "Cadmium",
          "Carbon",
          "Chromatic Metal",
        ]);

        // complex example... Stasis Device

        component = 'Stasis Device';
        componentTree = buildComponentTree(component);

        expect(componentTree.aggregatedRawMaterials).toEqual([
          {name: "Cactus Flesh", qty: 100, cost: 2800},
          {name: "Condensed Carbon", qty: 500, cost: 12000},
          {name: "Dioxite", qty: 50, cost: 3100},
          {name: "Faecium", qty: 50, cost: 1500},
          {name: "Frost Crystal", qty: 140, cost: 1680},
          {name: "Gamma Root", qty: 400, cost: 6400},
          {name: "Ionised Cobalt", qty: 150, cost: 60150},
          {name: "Paraffinium", qty: 50, cost: 3100},
          {name: "Phosphorus", qty: 1, cost: 62},
          {name: "Radon", qty: 1500, cost: 30000},
          {name: "Solanium", qty: 200, cost: 14000},
          {name: "Star Bulb", qty: 200, cost: 6400},
          {name: "Sulphurine", qty: 500, cost: 10000}
        ]);
      });

      it('Should calculate cost of aggregated raw materials and add the total to the top level as rawMaterialsTotalCost', ()=> {
        let component = 'Microprocessor';
        let componentTree = buildComponentTree(component);

        expect(componentTree.rawMaterialsTotalCost).toEqual(
          (7 * 50) +     // 50 x Carbon
            (245 * 40)   // 40 x Chromatic Metal
        );
      });

      it('should calculate the profit of the craftable component and add it to the top level as profit', ()=> {
        let component = 'Stasis Device';
        let componentTree = buildComponentTree(component);

        // 15,326,628 = value - rawMaterialsTotalCost;
        expect(componentTree.profit).toEqual(componentTree.value - componentTree.rawMaterialsTotalCost);
      });

      it('should aggregate components..?', () => {
        let component = 'Stasis Device';
        let componentTree = buildComponentTree(component);

        expect(componentTree.aggregatedComponents.length).toEqual(22);
        expect(componentTree.aggregatedComponents[0]).toEqual({
          name: "Quantum Processor",
          cost: 5200000,
          qty: 1
        });
      });

      example('validate componentTree for AtlasPass v2', ()=> {
        let component = 'AtlasPass v2';
        let componentTree = buildComponentTree(component);

        let expectedTree = {
          name: "AtlasPass v2",
          value: 1856,
          rawMaterialsTotalCost: 56950,
          profit: -55094,
          aggregatedComponents: [
            {
              name: "Microprocessor",
              cost: 2000,
              qty: 1
            },
            {
              name: "Carbon Nanotubes",
              cost: 500,
              qty: 1
            }
          ],
          aggregatedRawMaterials: [
            {name: "Cadmium", qty: 200, cost: 46800},
            {name: "Carbon", qty: 50, cost: 350},
            {name: "Chromatic Metal", qty: 40, cost: 9800},
          ],
          craftable: [
            {
              name: "Microprocessor",
              qty: 1,
              cost: 2000,
              craftable: [
                {
                  name: "Carbon Nanotubes",
                  qty: 1,
                  cost: 500,
                  craftable: [],
                  rawMaterials: [
                    {
                      name: "Carbon",
                      qty: 50,
                      cost: 7 * 50
                    }
                  ]
                }
              ],
              rawMaterials: [
                {
                  name: "Chromatic Metal",
                  qty: 40,
                  cost: 40 * 245
                }
              ]
            }
          ],
          rawMaterials: [
            {
              name: "Cadmium",
              qty: 200,
              cost: 200 * 234
            }
          ]
        };

        expect(componentTree).toEqual(expectedTree);
      });
    });
  });
});
