from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from io import BytesIO
from gradio_client import Client
from PIL import Image
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS to allow all origins (no credentials) for local dev
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)


def generate_avatar(description: str) -> BytesIO:
    try:
        # Initialize the Hugging Face FLUX.1-dev client
        client = Client("black-forest-labs/FLUX.1-dev")
        
        # Enhance the prompt for better character generation
        enhanced_prompt = (
            f"High-quality digital art portrait of {description}, "
            "fantasy character, detailed face, expressive eyes, "
            "professional artwork, 8k resolution, trending on artstation"
        )
        
        # Generate image using the FLUX.1-dev model
        result = client.predict(
            prompt=enhanced_prompt,
            seed=0,
            randomize_seed=True,
            width=512,  # Reduced size for faster generation
            height=512,
            guidance_scale=3.5,
            num_inference_steps=28,
            api_name="/infer"
        )
        
        # The result will be a path to the generated image
        # Load the image and convert to BytesIO
        with Image.open(result) as img:
            output = BytesIO()
            img.save(output, format='PNG')
            output.seek(0)
            return output
    except Exception as e:
        print(f"Error generating image: {e}")
        # Fallback to a colored placeholder if API fails
        img = Image.new('RGB', (512, 512), color='purple')
        output = BytesIO()
        img.save(output, format='PNG')
        output.seek(0)
        return output


@app.route('/generate-avatar', methods=['POST'])
def generate_avatar_api():
    try:
        logger.info("Received avatar generation request")
        if not request.is_json:
            logger.error("Request does not contain JSON data")
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        data = request.get_json()
        description = data.get('description', 'NFT Character')
        logger.info("Processing avatar generation for description: %s", description)

        img_io = generate_avatar(description)

        response = send_file(
            img_io,
            mimetype='image/png'
        )
        logger.info("Successfully sent generated image")
        return response

    except Exception as e:
        logger.error("Error in generate_avatar_api: %s", str(e))
        return jsonify({'error': str(e)}), 500


@app.route('/generate-avatar', methods=['OPTIONS'])
def generate_avatar_options():
    # Explicitly respond to preflight requests for browsers
    origin = request.headers.get('Origin', '*')
    logger.debug("Preflight request from Origin: %s", origin)
    # Return no content but include the required CORS headers
    from flask import make_response
    resp = make_response(('', 204))
    resp.headers['Access-Control-Allow-Origin'] = origin
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = (
        'Content-Type, Authorization, Accept, X-Requested-With'
    )
    resp.headers['Access-Control-Allow-Credentials'] = 'false'
    return resp


@app.route('/')
def index():
    return jsonify({"status": "Avatar API running"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)


@app.after_request
def ensure_cors(response):
    # Echo the Origin header back to the client when present (safe for local dev)
    origin = request.headers.get('Origin')
    logger.debug("After-request hook, request Origin: %s", origin)
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
    else:
        response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = (
        'Content-Type, Authorization, Accept, X-Requested-With'
    )
    response.headers['Access-Control-Allow-Credentials'] = 'false'
    return response
