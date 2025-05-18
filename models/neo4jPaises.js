
const crearPais = (nombre, poblacion, continente) => `
  MERGE (p:Pais {nombre: '${nombre}'})
  SET p.poblacion = '${poblacion}', p.continente = '${continente}'
`;

const crearCiudad = (nombre, poblacion, latitud, longitud, pais) => `
  MERGE (c:Ciudad {nombre: '${nombre}'})
  SET c.poblacion = '${poblacion}', c.latitud = '${latitud}', c.longitud = '${longitud}'
  WITH c
  MATCH (p:Pais {nombre: '${pais}'})
  MERGE (c)-[:perteneceA]->(p)
`;

const crearSitio = (nombre, tipo, ciudad) => `
  MERGE (s:Sitio {nombre: '${nombre}'})
  SET s.tipo = '${tipo}'
  WITH s
  MATCH (c:Ciudad {nombre: '${ciudad}'})
  MERGE (s)-[:ubicadoEn]->(c)
`;

const crearPlato = (nombre, tipo, ciudad) => `
  MERGE (p:Plato {nombre: '${nombre}'})
  SET p.tipo = '${tipo}'
  WITH p
  MATCH (c:Ciudad {nombre: '${ciudad}'})
  MERGE (p)-[:comidaTipica]->(c)
`;

const crearRelacionPlatoSitio = (plato, sitio) => `
  MATCH (p:Plato {nombre: '${plato}'}), (s:Sitio {nombre: '${sitio}'})
  MERGE (p)-[:preparaEn]->(s)
`;

const crearPersonaFamosa = (nombre, tipo, nacimiento, ciudad) => `
  MERGE (pe:Persona {nombre: '${nombre}'})
  SET pe.tipo = '${tipo}', pe.nacimiento = '${nacimiento}'
  WITH pe
  MATCH (c:Ciudad {nombre: '${ciudad}'})
  MERGE (pe)-[:famosoDe]->(c)
`;

module.exports = {
  crearPais,
  crearCiudad,
  crearSitio,
  crearPlato,
  crearRelacionPlatoSitio,
  crearPersonaFamosa,
};
