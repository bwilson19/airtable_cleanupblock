import {
  initializeBlock,
  useBase,
  ProgressBar,
  Button,
  useRecordIds,
  ConfirmationDialog,
  Box,
} from '@airtable/blocks/ui';

import React, { useState } from 'react';

function CleanUpBlock() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const base = useBase();

  // totals base records and picks progress bar color

  let lengthArray = [];
  const baseRecords = base.tables.forEach((table) => {
    let recordIds = useRecordIds(table);
    let tableSums = recordIds.length;
    lengthArray.push(tableSums);
  });
  const baseRecordSum = (arr) => arr.reduce((a, b) => a + b, 0);
  let total = baseRecordSum(lengthArray);
  let baseProgress = total / 100000;
  let roundedBaseProgress = baseProgress.toFixed(4);
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
        <h1 align="center">Clean Up (Base: {base.name})</h1>
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
          <Button>Find Duplicates</Button>
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
              This option will move all published posts to the &quot;Archived
              Table&quot;
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Archive</Button>
          {isDialogOpen && (
            <ConfirmationDialog
              title="Are you sure?"
              body="This action can’t be undone."
              onConfirm={() => {
                setIsDialogOpen(false);
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
              This option will move all published posts to the &quot;Archived
              Table&quot;
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Archive</Button>
          {isDialogOpen && (
            <ConfirmationDialog
              title="Are you sure?"
              body="This action can’t be undone."
              onConfirm={() => {
                setIsDialogOpen(false);
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
              This option will move all published posts to the &quot;Archived
              Table&quot;
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Archive</Button>
          {isDialogOpen && (
            <ConfirmationDialog
              title="Are you sure?"
              body="This action can’t be undone."
              onConfirm={() => {
                setIsDialogOpen(false);
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
