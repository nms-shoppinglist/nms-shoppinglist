// spec
var it, expect, describe, beforeEach, afterEach;
var searchForComponent, buildComponentTree, filterOnRawMaterials;

let example = it;

describe ("No Man's Sky - Crafting Shopping List", () => {

  describe('pages', () => {
    describe('index', () => {
      it('displays table of components', () => {
        let page = document;

        indexPage();

        let table = page.getElementById('indexPage');

        expect(table.tagName).toEqual('TABLE');

        expect(Array
               .from(table.rows)
               .map( i => i
                     // get the Table text
                     .innerText
                     // TABS to spaces
                     .replaceAll("\t", " ") ))
          .toEqual([
            'Item Value',
            'Stasis Device 15,600,000',
            'Fusion Ignitor 15,600,000',
            'Quantum Processor 5,200,000',
            'Portable Reactor 4,200,000',
            'Cryogenic Chamber 3,800,000',
            'Superconductor 2,000,000',
            'Cryo-Pump 1,500,000',
            'Fusion Accelerant 1,500,000',
            'Circuit Board 916,250',
            'Liquid Explosive 800,500',
            'Living Glass 566,000',
            'Semiconductor 400,000',
            'Hot Ice 400,000',
            'Organic Catalyst 320,000',
            'Acid 188,000',
            'Heat Capacitor 180,000',
            'Grantine 150,000',
            'Geodesite 150,000',
            'Iridesite 150,000',
            'Poly Fibre 130,000',
            'Lubricant 110,000',
            'Nitrogen Salt 50,000',
            'Enriched Carbon 50,000',
            'Thermic Condensate 50,000',
            'Unstable Gel 50,000',
            'Warp Cell 46,750',
            'Warp Hypercore 46,750',
            'Lemmium 25,000',
            'Dirty Bronze 25,000',
            'Magno-Gold 25,000',
            'Aronium 25,000',
            'Herox 25,000',
            'Amino Chamber 12,300',
            'Antimatter Housing 6,500',
            'Magnetic Resonator 6,150',
            'Solar Mirror 6,150',
            'Antimatter 5,233',
            'Quantum Computer 4,200',
            'Hydraulic Wiring 3,600',
            'AtlasPass v3 2,613',
            'Microprocessor 2,000',
            'AtlasPass v2 1,856',
            'AtlasPass v1 825',
            'Metal Plating 800',
            'Hermetic Seal 800',
            'Carbon Nanotubes 500',
            'Glass 200',
            'Di-hydrogen Jelly 200',
            'Ion Battery 200',
            'Life Support Gel 200'
          ]);

        table.remove();
      });
    });

    describe('shopping list', () => {
      let item = 'Solar Mirror';

      beforeEach(() => {
        shoppingList(item);
      });

      it('displays item title', () => {
        let title = document.querySelector('h1');
        expect(title.innerText).toEqual('Solar Mirror');
      });

      it('displays item value', () => {
        let value = document.querySelector('p.component-value').innerText;
        expect(value).toEqual('Value 6,150u');
      });

      it('displays item profit', () => {
        let profit = document.querySelector('p.component-profit').innerText;
        expect(profit).toEqual('Profit -11,085u / Margin: -180.2% / Markup: -64.3%');
      });

      it('displays item cost', () => {
        let profit = document.querySelector('p.component-cost').innerText;
        expect(profit).toEqual('Cost 17,235u');
      });

      it(`displays item raw materials`, () => {
        let profit = document.querySelector('h2#raw_materials_title').innerText;
        expect(profit).toEqual('Raw Materials');

        let rawMaterialsText = Array.from(
          document.querySelector('#resources_table').children
        ).map( e => e.innerText.replaceAll('\t', ' ').trim() );

        expect(rawMaterialsText).toEqual(
          [
            `Component Quantity Cost`,
            `Chromatic Metal 25 6,125`,
            `Gold 40 8,080`,
            `Silver 30 3,030`,
            `Total Cost  17,235`,
            `Net Profit  -11,085`,
            `Profit Margin  -180.2%`,
            `Profit Markup  -64.3%`
          ]);
      });

      it(`displays item construction overview`, () => {
        let profit = document.querySelector('h2#graph').innerText;
        expect(profit).toEqual('Construction Overview');
      });

      afterEach((done) => {
        setTimeout(() => cleanUpRenderedHTML(done), 100);
      });

    });
  });


  describe('HTML helpers', () => {

    describe('displayElement', () => {

      it('displays an html element containing text/innerHTML', () => {
        let element = displayElement("Hello world");

        expect(element.innerHTML).toEqual('Hello world');
        expect(element.textContent).toEqual('Hello world');

        element.remove();
      });

      it('generates css classname from haml/slim style syntax', () => {
        let element = displayElement("Div with css class 'hello'", "div.hello.world");

        expect(element.tagName).toEqual('DIV');
        expect(element.className).toEqual('hello world');
        expect(element.id).toEqual('');

        element.remove();
      });

      it('generates tag name from haml/slim style syntax', () => {
        let element = displayElement("Div with css class 'hello'", "div.hello");

        expect(element.tagName).toEqual('DIV');
        expect(element.id).toEqual('');

        element.remove();
      });

      it('generates id from haml/slim style syntax', () => {
        let element = displayElement("Div with css class 'hello'", "div.hello#hello_div");

        expect(element.tagName).toEqual('DIV');
        expect(element.className).toEqual('hello');
        expect(element.id).toEqual('hello_div');

        element.remove();
      });

      it('defaults to div if element tag name is not specified in element selector', () => {
        let element = displayElement("Defaults to DIV", "#testNode");

        expect(element.tagName).toEqual('DIV');
        expect(element.id).toEqual('testNode');

        element.remove();
      });


    });

  });

  describe('Graphviz features', () => {

    it('generates digraph of resources from item name', () => {
      let subject = generateDigraph('AtlasPass v2');
      expect(subject).toEqual(`"AtlasPass v2" -> "Cadmium" "AtlasPass v2" -> "Microprocessor" "Microprocessor" -> "Chromatic Metal" "Microprocessor" -> "Carbon Nanotubes" "Carbon Nanotubes" -> "Carbon"`);
    });

    // Bug Solar Mirror (etc) - fixed
    it('generates the digraph for Solar Mirror', () => {
      let subject = generateDigraph('Solar Mirror');
      expect(subject).toEqual(`"Solar Mirror" -> "Gold" "Solar Mirror" -> "Silver" "Solar Mirror" -> "Chromatic Metal"`);
    });


    it('generates an array of node names', () => {
      let subject = generateNodeNames('AtlasPass v2');
      expect(subject).toEqual([
        'AtlasPass v2',
        'Cadmium',
        'Microprocessor',
        'Chromatic Metal',
        'Carbon Nanotubes',
        'Carbon',
      ]);
    });

    it('generates a node list', () => {
      let subject = generateNodeList('AtlasPass v2', 'shape="box"');

      expect(subject).toEqual(`"AtlasPass v2" [shape="box", href="/?item=AtlasPass v2"]\n"Cadmium" [shape="box", href="/?item=Cadmium"]\n"Microprocessor" [shape="box", href="/?item=Microprocessor"]\n"Chromatic Metal" [shape="box", href="/?item=Chromatic Metal"]\n"Carbon Nanotubes" [shape="box", href="/?item=Carbon Nanotubes"]\n"Carbon" [shape="box", href="/?item=Carbon"]`);
    });

  });

  describe('searchForComponent', () => {

    let stasisDevice = searchForComponent('Stasis Device');
    it('should find a component by name, in the crafting data', () => {
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

  describe('filters', () => {
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
      it('should return only raw materials', () => {
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
      it('should return only craftable resources', () => {
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
    describe('building component tree', () => {

      it('should create a new object tree for the component', () => {
        let component = 'Living Glass';
        let componentTree = buildComponentTree(component);

        expect(component).not.toBe(componentTree); // not a reference!
        expect(componentTree.name).toEqual('Living Glass');
        expect(componentTree.value).toEqual(566000);
      });

      it('should provide a list of craftable componentns separate from raw materials', () => {
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

      it('Should aggregate raw materials for the component', () => {
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

      it('Should calculate cost of aggregated raw materials and add the total to the top level as rawMaterialsTotalCost', () => {
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

      it('should calculate the profit of the craftable component and add it to the top level as profit', () => {
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

      example('validate componentTree for AtlasPass v2', () => {
        let component = 'AtlasPass v2';
        let componentTree = buildComponentTree(component);

        let expectedTree = {
          name: "AtlasPass v2",
          value: 1856,
          rawMaterialsTotalCost: 56950,
          profit: -55094,
          profitMargin: '-2968.4%',
          profitMarkup: '-96.7%',
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

function cleanUpRenderedHTML(done) {
  let protectedChildren = document.querySelector('.jasmine_html-reporter');

  // Remove HTML rendered during test
  Array
    .from(document.body.children)
    .filter( e => e != protectedChildren )
    .forEach( e => e.remove() );

  done();
}
