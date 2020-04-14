import {
  initializeBlock,
  useBase,
  ProgressBar,
  Button,
  useRecordIds,
  useRecords,
  ConfirmationDialog,
  Box,
} from '@airtable/blocks/ui';

import React, { useState, useEffect } from 'react';

function CleanUpBlock() {
  // states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [storedTitles, setStoredTitles] = useState([]);
  const [storedPublishedRecords, setStoredPublishedRecords] = useState([]);

  //   global variables

  const base = useBase();
  const editorialTable = base.getTableByName('Editorial');
  const archiveTable = base.getTableByName('Archive');
  const publishedView = editorialTable.getViewByName('Published Pieces');
  const allRecords = useRecords(editorialTable);
  const publishedRecords = useRecords(publishedView);

  //   store records in state

  useEffect(() => {
    setStoredPublishedRecords(publishedRecords);
    findTitles(allRecords);
  }, []);

  // find and store duplicate article records in state
  function findTitles() {
    let titleArray = [];
    for (let i = 0; i < allRecords.length; i++) {
      let recordTitle = allRecords[i].getCellValue(editorialTable.primaryField);
      titleArray.push(recordTitle);
    }
    setStoredTitles(titleArray)
  }

  function findDuplicates(arr) {
    let sorted_arr = arr.slice().sort();
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (
        sorted_arr[i + 1] == sorted_arr[i]
      ) {
        results.push(sorted_arr[i]);
      }
    }
    setDuplicates(results);
    console.log(results);
  }

  function archivePublished() {
    setIsDialogOpen(false);
    console.log(storedPublishedRecords);
    // deletePublishedRecords(storedPublishedRecords);
  }

  //   delete published records after moving to archive

  const BATCH_SIZE = 50;
  async function deletePublishedRecords(records) {
    let i = 0;
    while (i < records.length) {
      const recordBatch = records.slice(i, i + BATCH_SIZE);
      await editorialTable.deleteRecordsAsync(recordBatch);
      i += BATCH_SIZE;
    }
  }

  // select and move published pieces to archive

  function archivePublished() {
    setIsDialogOpen(false);
    console.log(storedPublishedRecords);
    // deletePublishedRecords(storedPublishedRecords);
  }

  // totals base records and picks progress bar color

  let lengthArray = [];
  const baseRecords = base.tables.forEach((table) => {
    // eslint-disable-next-line
    let recordIds = useRecordIds(table);
    let tableSums = recordIds.length;
    lengthArray.push(tableSums);
  });
  const baseRecordSum = (arr) => arr.reduce((a, b) => a + b, 0);
  let total = baseRecordSum(lengthArray);
  let baseProgress = total / 100000;
  let roundedBaseProgress = baseProgress.toFixed(3);
  let baseColor;
  if (baseProgress < 0.5) {
    baseColor = '#006600';
  } else if (baseProgress < 0.8) {
    baseColor = '#ff9933';
  } else {
    baseColor = '#ff3333';
  }

  // maps each table and their progress bars

  const tables = base.tables.map((table) => {
    // eslint-disable-next-line
    let recordIds = useRecordIds(table);
    let progress = recordIds.length / 50000;
    let roundedProgress = progress.toFixed(4);
    let color;
    if (progress < 0.5) {
      color = '#006600';
    } else if (progress < 0.8) {
      color = '#ff9933';
    } else {
      color = '#ff3333';
    }

    return (
      <li style={{ paddingBottom: '1rem' }} key={table.id}>
        {table.name + ': '}
        <span style={{ fontWeight: 'bold' }}>
          {roundedProgress * 100 + '%'}
        </span>{' '}
        ({recordIds.length + ' / 50000'})
        <ProgressBar height="1rem" progress={progress} barColor={color} />
      </li>
    );
  });

  return (
    <>
      <div style={{ padding: '1rem' }}>
        <h1 align="center" style={{ textDecoration: 'underline' }}>
          Clean Up Tool (Base: {base.name})
        </h1>
        <h2>Base Records Used {baseRecords}</h2>
        <p>
          <span style={{ fontWeight: 'bold' }}>
            {roundedBaseProgress * 100 + '%'}
          </span>{' '}
          ({total + ' / 100000'})
        </p>
        <ProgressBar
          height="1rem"
          progress={baseProgress}
          barColor={baseColor}
        />
        <h2>Table Records Used</h2>
        <ul style={{ listStyleType: 'none', paddingInlineStart: '0px' }}>
          {tables}
        </ul>
        <h2>Recommendations</h2>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          border="default"
          backgroundColor="beige"
          padding={3}
          marginBottom={3}
          overflow="hidden"
        >
          <div>
            <h3>Find & Remove Duplicates</h3>
            <p>
              This option will search through each table to make sure that there
              are no duplicate records taking up any space.
            </p>
          </div>
          <Button onClick={() => findDuplicates(storedTitles)}>
            Find Duplicates
          </Button>
          <Button onClick={() => console.log(duplicates)}>
            Show Duplicated
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          border="default"
          backgroundColor="beige"
          padding={3}
          marginBottom={3}
          overflow="hidden"
        >
          <div>
            <h3>Archive Published Records</h3>
            <p>
              This option will move all published posts to the
              &quot;Archive&quot; table.
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Archive</Button>
          {isDialogOpen && (
            <ConfirmationDialog
              title="Are you sure?"
              body="This action can’t be undone."
              onConfirm={() => {
                archivePublished();
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          border="default"
          backgroundColor="beige"
          padding={3}
          marginBottom={3}
          overflow="hidden"
        >
          <div>
            <h3>Archive Old Records</h3>
            <p>
              This option will move all historical records from 2015 or older to
              the &quot;Archive&quot; table.
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Archive</Button>
          {isDialogOpen && (
            <ConfirmationDialog
              title="Are you sure?"
              body="This action can’t be undone."
              onConfirm={() => {
                archivePublished();
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          border="default"
          backgroundColor="beige"
          padding={3}
          marginBottom={3}
          overflow="hidden"
        >
          <div>
            <h3>Delete Archive</h3>
            <p>
              Removes all records from the &quot;Archive.&quot;&nbsp;
              <span style={{ fontWeight: 'bold' }}>
                (Please note: This action cannot be undone)
              </span>
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Archive</Button>
          {isDialogOpen && (
            <ConfirmationDialog
              title="Are you sure?"
              body="This action can’t be undone."
              onConfirm={() => {
                archivePublished();
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </Box>
      </div>
    </>
  );
}

initializeBlock(() => <CleanUpBlock />);
