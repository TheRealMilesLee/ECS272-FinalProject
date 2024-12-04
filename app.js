import { SankeyDiagram } from "./src/Diagrams";
import './src/Behavior.js';
import
{
  LineChart, BarChart, TransmissionBarChart,
  mountSankey, mountLineChart, mountScatter, mountTransmissionBarChart
} from "./src/Diagrams.js";
import "./style.css";
import { displayFinalComponent } from './src/FinalCars.js';
import './src/SelectBrandModel.js';

document.querySelector("#Header").innerHTML = `
  <header>
    <nav class="navigationbar">
      <ul>
        <li><a href="#MainBody">Home</a></li>
        <li><a href="#SankeyOverview">Overview</a></li>
        <li><a href="#GetStarted">Get Started</a></li>
        <li><a href="#LineChart">Age & Price Trend</a></li>
        <li><a href="#BarChart">Mileage & Price Trend</a></li>
        <li><a href="#TransmissionChart">Transmission Distribution</a></li>
        <li><a href="#CityBrandChart">City Brand Distribution</a></li>
        <li><a href="#ModelSalesChart">Model Sales Distribution</a></li>
        <li><a href="#EngineCategoryChart">Engine Capacity Distribution</a></li>
      </ul>
    </nav>
  </header>
`;

document.querySelector("#MainBody").innerHTML = `
  <section class="GreetingPage">
    <div>
      <h1>Story on Wheels: A used car filter just for you</h1>
    </div>
  </section>

  <section id="SankeyOverview">
    <div>
       ${ SankeyDiagram() }
    </div>
  </section>

  <section id="GetStarted">
    <div>
      <h2>Get Started</h2>
      <p> Let's start by price range. Our data price ranges from 30000 all the way to the 100k+ </p>
      <p> My budget is under
        <input type="number" id="BudgetInputBox">
        <button id="StartButton">Start Filtering</button>
      </p>
    </div>
    <p id="AfterBudgetPrompt" style="display: none;"> This is what we have so far, scroll to see more </p>
    <div id="FilterTable1" style="display: none;">
      <!-- Create a table to show after filtered data -->
    </div>
  </section>

  <section id="LineChart" style="display: none;">
    <div>
    ${ LineChart() }
      <p id="AfterAgePrompt" style="display: none;"> This is what we have so far, scroll to see more </p>
      <div id="FilterTable2" style="display: none;">
        <!-- Create a table to show after filtered data -->
      </div>
    </div>
  </section>

  <section id="BarChart" style="display: none;">
    <div>
      ${ BarChart() }
      <p id="AfterMileagePrompt" style="display: none;"> This is what we have so far, scroll to see more </p>
      <div id="FilterTable3" style="display: none;">
        <!-- Create a table to show after filtered data -->
      </div>
    </div>
  </section>

  <section id="TransmissionBarChart" style="display: none;">
    <div>
      ${ TransmissionBarChart() }
      <p id="AfterTransmissionPrompt" style="display: none;"> This is what we have so far, scroll to see more </p>
      <div id="FilterTable4" style="display: none;">
        <!-- Create a table to show after filtered data -->
      </div>
    </div>
  </section>

  </section id="BrandModel"  style="display: none;">
    <div>
      <h2> Choose Brand and Model </h2>
      <div class="dropdown-Brand-Model">
        <select name="Brand" id="Brand">
        </select>
        <p> With the model of </p>
        <select name="Model" id="Model">
        </select>
      </div>
    </div>
  </section>

  <section id="FinalCarChoices">
    <div class="final-content">
      <h2>Congratulations! Here are your ideal car choices:</h2>
      <div id="FinalTable"></div>
    </div>
  </section>

  <section id="FinalCarChoices">
    <div class="final-content">
      <h2>Congratulations! Here are your ideal car choices:</h2>
      <div id="FinalTable"></div>
    </div>
  </section>

  <section id="FinalCarChoices">
    <div class="final-content">
      <h2>Congratulations! Here are your ideal car choices:</h2>
      <div id="FinalTable"></div>
    </div>
  </section>
`;
mountSankey();
mountLineChart();
mountScatter();
mountTransmissionBarChart();
