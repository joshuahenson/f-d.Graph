/* global d3 */

const width = 800;
const height = 600;

const force = d3.layout.force()
    .charge(-120)
    .linkDistance(50)
    .size([width, height]);

const svg = d3.select('#root').append('svg')
    .attr('width', width)
    .attr('height', height);

const defs = svg.append('defs');

// d3.json('data.json', (error, data) => {
//   if (error) console.error(error);

// todo convert raw json api into usable nodes/links

const graph = {
  nodes: [
    { author: 'fcc', value: 50, avatar: 'https://cdn-images-2.medium.com/fit/c/36/36/1*MotlWcSa2n6FrOx3ul89kw.png' },
    { author: 'q', value: 5, avatar: 'https://cdn-images-2.medium.com/fit/c/36/36/1*CEi35YFI3DqbuAu0jAhFYA.jpeg' },
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
  .enter().append('g')
    .attr('class', 'node')
    .call(force.drag);

// create patterns to fill circles with avatars
graph.nodes.filter(d => d.avatar).forEach(d => {
  const r = Math.pow(d.value * 125, 1 / 3);
  const size = r * 2;
  defs.append('pattern')
    .attr('id', d.author)
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', size)
    .attr('height', size)
    .attr('x', -r)
    .attr('y', -r)
    .append('image')
      .attr('xlink:href', d.avatar)
      .attr('width', size)
      .attr('height', size)
      .attr('x', 0)
      .attr('y', 0);
});

// append circle filled with image pattern for avatars or color
node.append('circle')
  .attr('r', d => Math.pow(d.value * 125, 1 / 3) || 5)
  .style('fill', d => (d.avatar ? `url(#${d.author})` : '#006400'));

force.on('tick', () => {
  link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

  node.attr('transform', d => `translate(${d.x}, ${d.y})`);
});
// }); // end json
