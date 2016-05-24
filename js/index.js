/* global d3 */

const width = 800;
const height = 600;

const force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

const svg = d3.select('#root').append('svg')
    .attr('width', width)
    .attr('height', height);

// d3.json('data.json', (error, data) => {
//   if (error) console.error(error);

// todo convert raw json api into usable nodes/links

const graph = {
  nodes: [
    { author: 'fcc', value: 50 },
    { author: 'q', value: 5 },
    { author: 'q', article: 'test' },
  ],
  links: [
    { source: 1, target: 0 },
    { source: 2, target: 1 },
  ]
};

force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

const link = svg.selectAll('.link')
      .data(graph.links)
    .enter().append('line')
      .attr('class', 'link');

const node = svg.selectAll('.node')
      .data(graph.nodes)
    .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 5)
      .call(force.drag);

force.on('tick', () => {
  link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

  node.attr('cx', d => d.x)
        .attr('cy', d => d.y);
});
// }); // end json
