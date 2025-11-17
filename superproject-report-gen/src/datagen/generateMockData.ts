import { faker } from '@faker-js/faker';

// --- Helper Functions ---

function createFakeGpsPoint() {
  return {
    type: 'Point',
    coordinates: [faker.location.longitude(), faker.location.latitude()],
  };
}

function createFakeBbox() {
  const x1 = faker.number.float({ min: 100, max: 200 });
  const y1 = faker.number.float({ min: 100, max: 200 });
  return {
    x1,
    y1,
    x2: x1 + faker.number.float({ min: 50, max: 150 }),
    y2: y1 + faker.number.float({ min: 50, max: 150 }),
    confidence: faker.number.float({ min: 0.5, max: 1 }),
  };
}

function createFakeUtmData() {
  // FIXED: Constrained pixels to safe integer range
  return {
    tly: [faker.number.float(), faker.number.float()],
    scaleFactor: faker.number.float(),
    tlxPixel: faker.number.int({ min: 0, max: 10000 }), 
    zoneNumber: faker.number.int({ min: 1, max: 60 }),
    bryPixel: faker.number.int({ min: 0, max: 10000 }),
    zone: `${faker.number.int({ min: 1, max: 60 })}${faker.helpers.arrayElement(['N', 'S'])}`,
    bry: [faker.number.float(), faker.number.float()],
    brx: [faker.number.float(), faker.number.float()],
    depthParameter: faker.number.float(),
    tlyPixel: faker.number.int({ min: 0, max: 10000 }),
    tlx: [faker.number.float(), faker.number.float()],
    brxPixel: faker.number.int({ min: 0, max: 10000 }),
  };
}

export function generateData() {
  console.log('Starting data generation...');

  const superprojects: any[] = [];
  const projects: any[] = [];
  const sections: any[] = [];
  const defects: any[] = [];

  // Shared IDs
  const sproid = `SPROID_${faker.string.uuid()}`;
  const coid = `COID_${faker.company.buzzNoun()}`;
  const creatorUid = `UID_${faker.string.uuid()}`;
  const creatorEmployeeid = `EID_${faker.string.uuid()}`;

  // --- Step 1: Create 1 Superproject ---
  const pTitle = faker.lorem.words(3); 
  
  const superproject = {
    sproid: sproid,
    proidList: [] as string[],
    projectTitle: pTitle,
    projectTitleLC: pTitle.toLowerCase(),
    roadSide: faker.helpers.arrayElement(['Left', 'Right', 'Both']),
    archived: false,
    creatorUid: creatorUid,
    creatorEmployeeid: creatorEmployeeid,
    companyName: faker.company.name(),
    coid: coid,
    videosCount: 0,
    accessList: [creatorUid],
    videos: {},
    allProjects: {},
    accessMap: { [creatorUid]: 'owner' },
    associatedProjects: [],
    dateCreated: faker.date.past(),
    status: faker.helpers.arrayElement([1, 2, 3]),
  };

  // --- Step 2: Create 20 Projects ---
  for (let i = 0; i < 20; i++) {
    const proid = `PROID_${faker.string.uuid()}`;
    superproject.proidList.push(proid);

    const projTitle = faker.lorem.words(3);

    const project = {
      proid: proid,
      sproid: superproject.sproid,
      groupVideosInfo: [
        { groupId: 1, videoPath: faker.internet.url() },
        { groupId: 2, videoPath: faker.internet.url() }
      ],
      // FIXED: Constrained to safe integer
      association: faker.number.int({ min: 1, max: 100000 }), 
      projectType: faker.helpers.arrayElement([1, 2, 3]),
      dateCreated: faker.date.recent(),
      showFreshIntroMob: faker.datatype.boolean(),
      showFreshIntroWeb: faker.datatype.boolean(),
      profilePic: faker.image.avatar(),
      detectionThumbnailPath: faker.image.url(),
      projectTitle: projTitle,
      roadSide: superproject.roadSide,
      camPos: faker.helpers.arrayElement(['Center', 'Left']),
      camDir: faker.helpers.arrayElement(['Forward', 'Backward']),
      identificationNo: faker.string.alphanumeric(10),
      clientName: faker.company.name(),
      streetName: faker.location.street(),
      startingAddress: faker.location.streetAddress(),
      endingAddress: faker.location.streetAddress(),
      direction: faker.helpers.arrayElement(['NB', 'SB', 'EB', 'WB']),
      totalLanes: faker.helpers.arrayElement(['1', '2', '3']),
      laneNumber: faker.helpers.arrayElement(['1', '2']),
      categories: { type: faker.lorem.word() },
      projectTitleLC: projTitle.toLowerCase(),
      companyName: superproject.companyName,
      creatorUid: superproject.creatorUid,
      creatorEmployeeid: superproject.creatorEmployeeid,
      coid: superproject.coid,
      cameraMountingHeight: `${faker.number.float({ min: 1.5, max: 3.0 })}m`,
      cameraInclination: `${faker.number.int({ min: 10, max: 30 })}deg`,
      typeOfRoad: faker.helpers.arrayElement(['Highway', 'Urban', 'Rural']),
      processingTime: `${faker.number.int({ min: 1, max: 24 })}h`,
      surveyDate: faker.date.past(),
      segregatedCyclepath: faker.datatype.boolean(),
      accessMap: superproject.accessMap,
      archived: false,
      conditionIndex: [faker.number.float({ min: 0, max: 100 }), faker.number.float({ min: 0, max: 100 })],
      videosCount: 2,
      videoMessage: faker.lorem.sentence(),
      isVideoUploadingOnDB: false,
      thumbnail: faker.image.url(),
      dimensions: { width: 1920, height: 1080 },
      fps: faker.helpers.arrayElement([30, 60]),
      videos: [{ path: faker.internet.url() }],
      paymentSubscriptionId: null,
      totalEstimatedDistance: faker.number.float({ min: 1000, max: 10000 }),
      payFromSubscription: false,
      hasNoDuplicate: true,
      isGpsDistanceValid: true,
      isVideoOrder: false,
      gpsApprovalMessage: 'Approved',
      isGpsEditDone: true,
      videoSelectionPath: {},
      baseCreditAmountRequired: faker.number.float({ min: 10, max: 100 }),
      calculatingPrice: false,
      realCost: { amount: faker.number.float({ min: 10, max: 100 }), currency: 'USD' },
      totalProcessingDistance: faker.number.float({ min: 1000, max: 10000 }),
      approxCreditsRequired: faker.number.float({ min: 10, max: 100 }),
      isVideoSelectionDone: true,
      isProjectUpdated: false,
      projectCreditJar: faker.string.uuid(),
      isHalted: false,
      analysisError: null,
      isHaltPossible: true,
      isHaltInProcess: false,
      cciInverted: false,
      videoPath: faker.internet.url(),
      frames: faker.number.int({ min: 10000, max: 50000 }),
      conditionMethod: 1,
      selectedDefects: [],
      isDefaultFilter: true,
      advancedFilters: {},
      analysisReqId: faker.string.uuid(),
      stitchHeight: 1080,
      stitchFps: 30,
      stitchFrame: 0,
      stitchVideoPath: faker.internet.url(),
      stitchWidth: 1920,
      status: 3,
      selectedRegionFilters: [],
      associatedNetworks: [],
      isForked: false,
      forkedFrom: null,
      forkedDataFrom: null,
      accessList: [creatorUid],
      calculateIRI: faker.datatype.boolean(),
      regionFilter: [{ id: 1, name: 'Region 1' }],
      laneType: 'Main',
      laneConfig: 'Single',
      laneSelection: 'This',
      shoulderDrop: 'None',
      isGnssStepDone: true,
      dx: faker.number.float(),
      dy: faker.number.float(),
    };
    projects.push(project);

    // --- Step 3: Create 500 Sections ---
    for (let j = 0; j < 500; j++) {
      const sectionId = `SECID_${faker.string.uuid()}`;
      const section = {
        sectionId: sectionId,
        sproid: project.sproid,
        coid: project.coid,
        supersectionId: `SSECID_${faker.string.uuid()}`,
        maskPathHR: faker.system.filePath(),
        lrWidth: 640,
        depthMapPath: faker.system.filePath(),
        tenMeterSectionId: `10M_SEC_${faker.string.uuid()}`,
        initIndex: j * 100,
        depthMapPathHR: faker.system.filePath(),
        groupId: 1,
        lrHeight: 480,
        endIndex: (j * 100) + 99,
        maskPath: faker.system.filePath(),
        groupInitIndex: j * 100,
        groupEndIndex: (j * 100) + 99,
        utmData: createFakeUtmData(),
        stitchPath: faker.system.filePath(),
        hrHeight: 1080,
        stitchPathHR: faker.system.filePath(),
        hrWidth: 1920,
        rci: faker.number.float({ min: 0, max: 10 }),
        startingGps: createFakeGpsPoint(),
        endingGps: createFakeGpsPoint(),
        gps: { lat: faker.location.latitude(), lng: faker.location.longitude(), time: faker.date.past().getTime() },
        frame: j,
        distance: faker.number.float({ min: 1, max: 10000 }),
        pci: faker.number.float({ min: 0, max: 100 }),
        cci: faker.number.float({ min: 0, max: 100 }),
        stitchFrameNumber: j * 30,
        dateCreated: faker.date.recent(),
        proid: project.proid,
        depthPath: faker.system.filePath(),
        assignNetworkMap: {},
      };
      sections.push(section);

      // --- Step 4: Create 5 Defects ---
      for (let k = 0; k < 5; k++) {
        const defect = {
          defectId: `DEFID_${faker.string.uuid()}`,
          dateCreated: faker.date.recent(),
          sectionId: section.sectionId,
          sproid: section.sproid,
          coid: section.coid,
          imageName: faker.system.fileName(),
          wheelPath: faker.number.float({ min: 0, max: 1 }),
          defectName: faker.number.int({ min: 1, max: 20 }),
          isRectangle: faker.datatype.boolean(),
          depth: faker.number.float({ min: 0, max: 50 }),
          length: faker.number.float({ min: 0, max: 500 }),
          area: faker.number.float({ min: 0, max: 10000 }),
          defectType: faker.number.int({ min: 1, max: 10 }),
          defectWidth: faker.number.float({ min: 0, max: 200 }),
          severity: faker.number.int({ min: 1, max: 3 }),
          geoTime: faker.date.past().getTime(),
          defectImagePath: faker.system.filePath(),
          profile: faker.number.float(),
          longitudinalSpan: faker.number.float(),
          // FIXED: Constrained to safe integer
          transversePosition: faker.number.int({ min: -5000, max: 5000 }),
          volume: faker.number.float(),
          gps: createFakeGpsPoint(),
          groupFrameNumber: section.frame,
          bbox: createFakeBbox(),
          groupId: section.groupId,
          frameNumber: section.frame,
          base64: null,
          hexCode: faker.color.rgb(),
          transverseSpan: faker.number.float(),
          firestoreDefectId: faker.string.uuid(),
          archived: 0,
          waterPumping: faker.number.int({ min: 0, max: 1 }),
          thickness: faker.number.float(),
          assignNetworkMap: {},
          gpsCorner: faker.location.direction(),
          gpsBbox: [faker.location.longitude(), faker.location.latitude(), faker.location.longitude(), faker.location.latitude()],
          isComplete: true,
          region: faker.number.int({ min: 1, max: 5 }),
        };
        defects.push(defect);
      }
    }
  }

  superproject.videosCount = projects.reduce((acc, p) => acc + p.videosCount, 0);
  superprojects.push(superproject);

  console.log('--- Generation Complete ---');
  console.log(`Superprojects: ${superprojects.length}`);
  console.log(`Projects: ${projects.length}`);
  console.log(`Sections: ${sections.length}`);
  console.log(`Defects: ${defects.length}`);

  return { superprojects, projects, sections, defects };
}