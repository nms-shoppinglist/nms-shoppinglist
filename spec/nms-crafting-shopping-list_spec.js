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

      it('Should aggregate raw materials for the component', ()=> {
        let component = 'AtlasPass v2';
        let componentTree = buildComponentTree(component);

        expect(Object.keys(componentTree.aggregatedRawMaterials[0])).toEqual([
          "name",
          "qty",
          "cost",
          "value"
        ]);

        expect(componentTree.aggregatedRawMaterials.map( i => i.name )).toEqual([
          "Cadmium",
          "Carbon",
          "Chromatic Metal",
        ]);

        // subcomponent qty > 1 ... Living Glass : 5x Glass + 1x Lubricant

        componentTree = buildComponentTree('Living Glass');
        expect(componentTree.aggregatedRawMaterials).toEqual([
          { name: 'Faecium', qty: 50, cost: 1500, value: 30 },
          { name: "Frost Crystal", qty: 200, cost: 2400, value: 12 },
          { name: 'Gamma Root', qty: 400, cost: 6400, value: 16 }
        ]);

        // complex example... Stasis Device

        component = 'Stasis Device';
        componentTree = buildComponentTree(component);

        expect(componentTree.aggregatedRawMaterials).toEqual([
          { name: "Cactus Flesh", qty: 100, cost: 2800, value: 28 },
          { name: "Condensed Carbon", qty: 300, cost: 7200, value: 24 },
          { name: "Dioxite", qty: 50, cost: 3100, value: 62 },
          { name: "Faecium", qty: 50, cost: 1500, value: 30 },
          { name: "Frost Crystal", qty: 300, cost: 3600, value: 12 },
          { name: "Gamma Root", qty: 400, cost: 6400, value: 16 },
          { name: "Ionised Cobalt", qty: 150, cost: 60150, value: 401 },
          { name: "Paraffinium", qty: 50, cost: 3100, value: 62 },
          { name: "Phosphorus", qty: 1, cost: 62, value: 62 },
          { name: "Radon", qty: 1000, cost: 20000, value: 20 },
          { name: "Solanium", qty: 200, cost: 14000, value: 70 },
          { name: "Star Bulb", qty: 200, cost: 6400, value: 32 },
          { name: "Sulphurine", qty: 500, cost: 10000, value: 20 }
        ]);
      });

      it('Should calculate cost of aggregated raw materials and add the total to the top level as rawMaterialsTotalCost', ()=> {
        let component = 'Microprocessor';
        let componentTree = buildComponentTree(component);

        expect(componentTree.rawMaterialsTotalCost).toEqual(
          // raw materials for Microprocessor...
          // Carbon (7u x 50)
          (7 * 50) +

          // Chromatic Metal (245u x 40)
          (245 * 40)
        );
      });

      it('should calculate the profit of the craftable component and add it to the top level as profit', ()=> {
        let component = 'Stasis Device';
        let componentTree = buildComponentTree(component);

        expect(componentTree.profit).toEqual(componentTree.value - componentTree.rawMaterialsTotalCost);
        expect(componentTree.profit).toEqual(15461688);
      });

      it('should calculate the cost of raw materials multiplied by the quantity of the component which requires them', () => {
        let componentTree = buildComponentTree('Living Glass');

        expect(componentTree.craftable).toContain({
          name: 'Glass',
          qty: 5,
          cost: 1000,
          value: 200,
          craftable: [  ],
          rawMaterials: [
            {
              name: 'Frost Crystal',
              qty: 200,
              cost: 2400,
              value: 12
            }
          ]});
      });

      describe('aggregating components', () => {

        it('should aggregate components', () => {
          let component = 'Stasis Device';
          let componentTree = buildComponentTree(component);

          let subject = componentTree.aggregatedComponents;

          expect(subject.length).toEqual(19);
          expect(subject[subject.length - 1]).toEqual({
            name: "Quantum Processor",
            cost: 5200000,
            value: 5200000,
            qty: 1
          });
        });

        it('should should reduce duplicates to one component, combining cost', () => {
          let componentTree = buildComponentTree('Stasis Device');

          let subject = componentTree.aggregatedComponents;
          let thermicCondensate = subject.filter( i => i.name == 'Thermic Condensate');

          expect(thermicCondensate.length).toEqual(1);

          let tc = thermicCondensate[0];

          expect(tc.qty).toEqual(2);
          expect(tc.cost).toEqual(tc.value * tc.qty);
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
              name: "Carbon Nanotubes",
              cost: 500,
              value: 500,
              qty: 1
            },
            {
              name: "Microprocessor",
              cost: 2000,
              value: 2000,
              qty: 1
            }
          ],
          aggregatedRawMaterials: [
            {name: "Cadmium", qty: 200, cost: 46800, value: 234},
            {name: "Carbon", qty: 50, cost: 350, value: 7},
            {name: "Chromatic Metal", qty: 40, cost: 9800, value: 245},
          ],
          craftable: [
            {
              name: "Microprocessor",
              qty: 1,
              cost: 2000,
              value: 2000,
              craftable: [
                {
                  name: "Carbon Nanotubes",
                  qty: 1,
                  cost: 500,
                  value: 500,
                  craftable: [],
                  rawMaterials: [
                    {
                      name: "Carbon",
                      qty: 50,
                      cost: 350,
                      value: 7
                    }
                  ]
                }
              ],
              rawMaterials: [
                {
                  name: "Chromatic Metal",
                  qty: 40,
                  value: 245,
                  cost: 9800
                }
              ]
            }
          ],
          rawMaterials: [
            {
              name: "Cadmium",
              qty: 200,
              cost: 46800,
              value: 234
            }
          ]
        };

        expect(componentTree).toEqual(expectedTree);
      });
    });
  });
});
