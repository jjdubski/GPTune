import subprocess
import sys
import os

try:
    # First check if node modules are installed
    if not os.path.exists('frontend/node_modules'):
        os.makedirs('frontend/node_modules')

    # Delete node_modules
    print('Deleting existing node_modules directory...')
    if os.name == 'posix':
        subprocess.run(['rm', '-rf', 'frontend/node_modules'])
        subprocess.run(['rm', 'frontend/package-lock.json'])
    else:
        subprocess.run(['rmdir', '/s', '/q', 'frontend\\node_modules'], shell=True)
        subprocess.run(['del', '/q', 'frontend\\package-lock.json'], shell=True)

    print('Installing node_modules...')
    subprocess.run(['npm', 'install'], cwd='frontend', shell=True)
    print('Node modules installed.')
    print('Starting app with docker compose...')
    try:
        subprocess.run(['docker-compose', 'up', '--build'], check=True, shell=True)
    except subprocess.CalledProcessError:
        try:
            subprocess.run(['docker', 'compose', 'up', '--build'], check=True, shell=True)
        except subprocess.CalledProcessError:
            print("Docker compose up failed, make sure it's running")
            sys.exit(1)

except KeyboardInterrupt:
    print("\nExiting...")

print('Bye-bye :)')
print('Run docker compose down -v to shutdown the containers and remove volumes')