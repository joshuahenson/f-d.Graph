/* global d3 */

const width = 1000;
const height = 800;

const color = d3.scale.category20b();

const force = d3.layout.force()
    .charge(-100)
    .linkDistance(d => d.linkDistance)
    .gravity(0.05)
    .size([width, height]);

const svg = d3.select('#root').append('svg')
    .attr('width', width)
    .attr('height', height);

const tooltip = d3.select('#root').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

const defs = svg.append('defs');

d3.json('../json/data.json', (error, data) => {
  if (error) console.error(error);
  const authorIndex = {};
  const nodes = [{ author: 'Free Code Camp Medium Articles', avatar: data.pubAvatar, value: 25 }];
  const links = [];

  // build nodes and links
  data.articles.forEach((d) => {
    const nodesLength = nodes.length;
    if (d.author in authorIndex) {
      nodes[authorIndex[d.author]].value += 1;
      links.push({ source: nodesLength, target: authorIndex[d.author],
        linkDistance: 50, stroke: color(authorIndex[d.author]) });
    } else {
      authorIndex[d.author] = nodesLength;
      nodes.push({ author: d.author, avatar: d.avatar, value: 1 });
      links.push({ source: nodesLength, target: 0, linkDistance: 200,
        stroke: color(authorIndex[d.author]), opacity: 0.5, strokeWidth: 1 });
      links.push({ source: nodesLength + 1, target: nodesLength,
        linkDistance: 50, stroke: color(authorIndex[d.author]) });
    }
    nodes.push({ author: d.author, title: d.title, url: d.url });
  });

  force
    .nodes(nodes)
    .links(links)
    .start();

  const link = svg.selectAll('.link')
      .data(links)
    .enter().append('line')
      .attr('class', 'link');

  const node = svg.selectAll('.node')
      .data(nodes)
    .enter().append('a')
      .attr('xlink:href', d => d.url)
      .attr('target', '_blank')
      .append('g')
        .attr('class', 'node')
        .call(force.drag);


  // create patterns to fill circles with avatars
  nodes.filter(d => d.avatar).forEach(d => {
    const r = Math.pow(d.value * 2000, 1 / 3);
    const size = r * 2;
    defs.append('pattern')
      .attr('id', d.author.replace(/ /g, '_'))
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
    .attr('r', d => Math.pow(d.value * 2000, 1 / 3) || 5)
    .style('fill', d => (
      d.avatar ? `url(#${d.author.replace(/ /g, '_')})` : color(authorIndex[d.author])))
    .on('mouseover', d => {
      tooltip.transition()
        .style('opacity', 1);
      tooltip.html(`<h3>${d.author}</h3>${d.title ? `<span>${d.title}</span>` : ''}`)
          .style('left', `${d3.event.pageX + 20}px`)
          .style('top', `${d3.event.pageY - 30}px`);
    })
    .on('mouseout', () => {
      tooltip.transition()
        .style('opacity', 0);
    });

  force.on('tick', () => {
    link.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .style('stroke', d => d.stroke)
      .style('opacity', d => d.opacity)
      .style('stroke-width', d => d.strokeWidth);

    node.attr('transform', d => `translate(${d.x}, ${d.y})`);
  });
}); // end d3.json
