import {
  initializeBlock,
  useBase,
  ProgressBar,
  Button,
  useRecordIds,
  ConfirmationDialog,
  Box,
  Text,
  Label,
} from '@airtable/blocks/ui';

import React, { useState } from 'react';

function CleanUpBlock() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const base = useBase();

  const tables = base.tables.map((table) => {
    const recordIds = useRecordIds(table);
    let progress = recordIds.length / 50000;
    let color;
    if (progress < 0.5) {
      color = 'green';
    } else if (progress < 0.8) {
      color = 'orange';
    } else {
      color = 'red';
    }

    return (
      <li style={{ paddingBottom: '1rem' }} key={table.id}>
            {table.name + ': '}
            <span style={{ fontWeight: 'bold' }}>{progress * 100 + '%'}</span> ({recordIds.length + ' / 50000'})
        <ProgressBar height="1rem" progress={progress} barColor={color} />
      </li>
    );
  });

  return (
    <>
      <div style={{ padding: '1rem' }}>
        <h1 align="center">Clean Up (Base: {base.name})</h1>
        <h2>Base Records Used</h2>
        <ProgressBar height="1rem" progress={0.8} barColor="#ff9900" />
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
