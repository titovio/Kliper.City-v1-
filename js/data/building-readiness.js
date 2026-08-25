(function () {
  'use strict';

  var buildings = window.KLIPER_BUILDINGS;
  if (!Array.isArray(buildings)) return;

  function normalizeStatus(status) {
    return String(status || '').toLowerCase().trim();
  }

  function isExplicitReady(status) {
    return status === 'готов' ||
      status === 'сдан' ||
      status === 'сдан полностью' ||
      status === 'проект сдан' ||
      status === 'завершен' ||
      status === 'завершён' ||
      status === 'отстроено' ||
      status.indexOf('готов') !== -1 ||
      status.indexOf('сдан') !== -1 ||
      status.indexOf('полностью отстро') !== -1 ||
      status.indexOf('проект сдан') !== -1 ||
      status.indexOf('заверш') !== -1 ||
      status.indexOf('заселен') !== -1 ||
      status.indexOf('заселён') !== -1;
  }

  function isUnderConstruction(status) {
    return status.indexOf('строится') !== -1 ||
      status.indexOf('строящий') !== -1 ||
      status.indexOf('строительство') !== -1;
  }

  buildings.forEach(function (building) {
    if (!building) return;

    var originalStatus = normalizeStatus(building.status);
    var projectStatus = normalizeStatus(building.projectStatus || building.completionStatus || '');
    var explicitReady = isExplicitReady(originalStatus);
    var explicitProjectReady = isExplicitReady(projectStatus);
    var underConstruction = isUnderConstruction(originalStatus);
    var activeProject = isUnderConstruction(projectStatus);

    var projectReadinessStatus = 'unknown';

    if (building.isCompletedResidentialProject === true ||
      building.allHousesDelivered === true ||
      explicitProjectReady ||
      explicitReady) {
      projectReadinessStatus = 'completed';
    } else if (activeProject || underConstruction) {
      projectReadinessStatus = 'active';
    }

    var housesTotal = Number(building.housesTotal || building.totalHouses || 0) || 0;
    var housesDelivered = Number(building.housesDelivered || building.deliveredHouses || 0) || 0;
    var housesRemaining = housesTotal > 0 ? Math.max(0, housesTotal - housesDelivered) : null;

    building.originalStatus = building.originalStatus || building.status || '';
    building.projectReadinessStatus = projectReadinessStatus;
    building.readinessStatus = projectReadinessStatus === 'completed' ? 'ready' :
      projectReadinessStatus === 'active' ? 'under_construction' :
      'unknown';
    building.isCompletedResidentialProject = projectReadinessStatus === 'completed';
    building.isReadyResidential = building.isCompletedResidentialProject;
    building.isActiveResidentialProject = projectReadinessStatus === 'active';
    building.isUnderConstruction = building.isActiveResidentialProject;
    building.housesTotal = housesTotal || building.housesTotal;
    building.housesDelivered = housesDelivered || building.housesDelivered;
    building.housesRemaining = housesRemaining;
    building.projectDeliveryYear = building.projectDeliveryYear || building.year || null;
    building.readinessSource = explicitProjectReady ? 'project-status' :
      explicitReady ? 'status' :
      building.allHousesDelivered === true ? 'all-houses-delivered' :
      building.isCompletedResidentialProject === true ? 'explicit-flag' :
      projectReadinessStatus === 'active' ? 'status' :
      'unknown';
  });

  window.KLIPER_BUILDING_READINESS = {
    version: 1,
    completedProjectCount: buildings.filter(function (building) { return building && building.isCompletedResidentialProject; }).length,
    activeProjectCount: buildings.filter(function (building) { return building && building.isActiveResidentialProject; }).length,
    unknownCount: buildings.filter(function (building) { return building && building.projectReadinessStatus === 'unknown'; }).length
  };
})();
