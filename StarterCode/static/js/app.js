// Declare the data variable in a higher scope
let data;

// Get the Roadster endpoint
const bb_ur = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and populate the dropdown options
d3.json(bb_ur).then(function(responseData) {
  // Assign the JSON data to the global data variable
  data = responseData;

  console.log(data);

  // Initialize an empty array to store sample names
  const bb_names = []
  const bb_samples = [];

  // Check if data.names is an array (to avoid nested arrays)
  if (Array.isArray(data.names)) {
    // If data.names is already an array, concatenate its contents with bb_names
    bb_names.push(...data.names);
  } else {
    // If data.names is not an array, push it as a single value into bb_names
    bb_names.push(data.names);
  }
  //Same code that was used to populate the data names
  if (Array.isArray(data.samples)) {
    // If data.names is already an array, concatenate its contents with bb_names
    bb_samples.push(...data.samples);
  } else {
    // If data.names is not an array, push it as a single value into bb_names
    bb_samples.push(data.samples);
  }

  console.log(bb_names);
  console.log(bb_samples);

  // Populate the dropdown with options
  const dropdown = document.getElementById("selDataset");
  for (const option of bb_names) {
    const optionElement = document.createElement("option");
    optionElement.value = option; // Set the value
    optionElement.textContent = option; // Set the displayed text
    dropdown.appendChild(optionElement); // Add the option to the dropdown
  }

  // Attach the change event listener to the dropdown after populating options
  d3.selectAll("#selDataset").on("change", optionChanged);
});


function optionChanged() {
  // Ensure data has been loaded before proceeding
  if (!data) {
    console.error("Data has not been loaded yet.");
    return;
  }

  console.log(data)
  // Get the selected dataset ID from the dropdown
  let dropdownMenu = d3.select("#selDataset");
  let datasetId = dropdownMenu.property("value");

  // Find the matching sample in the samples array based on the selected ID
  let selectedSample = data.samples.find(sample => sample.id === datasetId);

  // Extract the otu_ids and sample_values
  let bar_otu_ids = selectedSample.otu_ids;
  let bar_sample_values = selectedSample.sample_values;
  let bar_sample_labels = selectedSample.otu_labels;

  bar_otu_ids_rev = bar_otu_ids.slice(0, 10).reverse();
  bar_sample_values_rev = bar_sample_values.slice(0, 10).reverse();

  // Create a trace for the bar chart
  let trace = {
    x: bar_sample_values_rev,
    y: bar_otu_ids_rev.map(id => `OTU ${id}`),
    type: 'bar',
    orientation: 'h'
  };

  // Create a data array containing the trace
  let bb_bar_data = [trace];

  // Define the layout for the chart
  let layout = {
    title: `Top 10 OTUs for Sample ${datasetId}`,
    xaxis: { title: 'Sample Values' },
    yaxis: { title: 'OTU IDs' }
  };

  // Create the bar chart using Plotly
  Plotly.newPlot('bar', bb_bar_data, layout);


  var bubble_trace = {
    x: bar_otu_ids,
    y: bar_sample_values,
    text: bar_sample_labels, 
    mode: 'markers',
    marker: {
      color: bar_otu_ids,
      size: bar_sample_values
    }
  }

  var bubble_data = [bubble_trace]

  Plotly.newPlot('bubble', bubble_data)



let selected_metadata = data.metadata.find(metadata => metadata.id.toString() === datasetId);
console.log('test meta data',selected_metadata.id)
console.log('test ID',datasetId)

let panelBody = d3.select(".panel-body");
panelBody.html("");

let metadataItems = [
  `ID: ${selected_metadata.id}`,
  `Ethnicity: ${selected_metadata.ethnicity}`,
  `Gender: ${selected_metadata.gender}`,
  `Age: ${selected_metadata.age}`,
  `Location: ${selected_metadata.location}`,
  `bbtype: ${selected_metadata.bbtype}`,
  `wfreq: ${selected_metadata.wfreq}`,
  // Add more items as needed
];

metadataItems.forEach(item => {
  panelBody.append("p").text(item);
});

  };



