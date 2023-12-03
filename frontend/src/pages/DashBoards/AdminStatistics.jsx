import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';

function AdminStatistics() {
    const iframeSources = [
        'https://lookerstudio.google.com/embed/reporting/452cd61b-545e-4b5a-990f-428182add46f/page/eK5jD',
        'https://lookerstudio.google.com/embed/reporting/641739dc-2a64-429e-8f5b-59b560f1c30b/page/IC5jD',
        'https://lookerstudio.google.com/embed/reporting/3e570b6f-ce33-409b-81e9-5edf0227c6af/page/7O5jD',
        'https://lookerstudio.google.com/embed/reporting/d14ecee9-1d2d-49cb-920e-4619b61f0bfe/page/FI5jD',
        'https://lookerstudio.google.com/embed/reporting/1534b4f9-08af-49e7-9d33-480285a2bb23/page/1i5jD',
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