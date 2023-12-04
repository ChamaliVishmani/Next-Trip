import os
import nbformat
from nbconvert import PythonExporter
import schedule
import time


def convertNotebookToScript(notebookPath, scriptPath):
    with open(notebookPath, 'r', encoding='utf-8') as nbFile:
        notebook = nbformat.read(nbFile, as_version=4)

    exporter = PythonExporter()
    source, _ = exporter.from_notebook_node(notebook)

    with open(scriptPath, 'w', encoding='utf-8') as script_file:
        script_file.write(source)


def execute_script(scriptPath):
    os.system(f'python {scriptPath}')


def trainPeriodically():
    print("Training models...")
    lat_Lon_Model_path = "../notebooks/Lat_Lon_Model.ipynb"
    lat_Lon_Model_script_path = "../notebooks/notebookScripts/Lat_Lon_ModelScript.py"

    convertNotebookToScript(lat_Lon_Model_path, lat_Lon_Model_script_path)
    execute_script(lat_Lon_Model_script_path)

    locationClusters_path = "../notebooks/LocationClusters.ipynb"
    locationClusters_script_path = "../notebooks/notebookScripts/LocationClustersScript.py"

    convertNotebookToScript(locationClusters_path,
                            locationClusters_script_path)
    execute_script(locationClusters_script_path)

    Maps_Model_path = "../notebooks/Maps_Model.ipynb"
    Maps_Model_script_path = "../notebooks/notebookScripts/Maps_ModelScript.py"

    convertNotebookToScript(Maps_Model_path, Maps_Model_script_path)
    execute_script(Maps_Model_script_path)
    print("Training complete.")


if __name__ == "__main__":
    # Run the training script every day at 2:00 AM
    schedule.every().day.at("14:20").do(trainPeriodically)

    while True:
        schedule.run_pending()
        time.sleep(1)
