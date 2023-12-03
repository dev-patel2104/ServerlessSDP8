import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';

function AdminStatistics() {
    const iframeSources = [
        'https://lookerstudio.google.com/embed/reporting/4a081105-04fd-4e2c-94ed-259e3fe02fd5/page/pW2jD',
        'https://example.com/iframe2',
        'https://example.com/iframe3',
        'https://lookerstudio.google.com/embed/reporting/91bc11ca-b60f-4617-afd5-105e3d5c3031/page/Te2jD',
        'https://example.com/iframe5',
      ];
  return (
    <Tabs isLazy>
    <TabList>
      <Tab>Top 10 restaurants with most orders</Tab>
      <Tab>Top 10 food items ordered across restaurants</Tab>
      <Tab>Top 10 periods when food was most ordered</Tab>
      <Tab>Top 10 customers with most orders</Tab>
      <Tab>Restaurant Reviews</Tab>
    </TabList>
    <TabPanels>
      {iframeSources.map((src, index) => (
        <TabPanel key={index}>
          <Box>
            <iframe title={`iframe-${index + 1}`} src={src} width="100%" height="620px" />
          </Box>
        </TabPanel>
      ))}
    </TabPanels>
  </Tabs>
  )
}

export default AdminStatistics