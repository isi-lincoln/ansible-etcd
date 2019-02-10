topo = {
  name: 'etcd',
  nodes: [buster('a'), buster('b'), buster('c')],
  switches: [cumulus('s')],
  links: [
    Link('a', 1, 's', 1),
    Link('b', 1, 's', 2),
    Link('c', 1, 's', 3),
  ]
}

function buster(name) {
  return {
    name: name,
    image: 'debian-buster',
    memory: { capacity: GB(2) },
    proc: { cores: 2 }
  }
}

function cumulus(name) {
  return {
    name: name,
    image: 'cumulusvx-3.5-mvrf',
    memory: { capacity: GB(2) },
    proc: { cores: 2 }
  }
}
