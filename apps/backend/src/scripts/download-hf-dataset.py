from datasets import load_dataset
import os

if __name__ == "__main__":
    dataset_name = "generative-technologies/synth-ehr-icd10-llama3-format"
    local_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "huggingface_data"))

    print(f"Downloading {dataset_name} to {local_path}...")
    ds = load_dataset(dataset_name)
    ds.save_to_disk(local_path)
    print("✅ Download complete.")
