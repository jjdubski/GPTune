import subprocess
import os

def check_command(command):
    try:
        subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return True
    except FileNotFoundError:
        print(f"\t\033[91mCommand not found: {command[0]}\033[0m")
        return False
    except subprocess.CalledProcessError:
        return False

try:
    # First check if node modules are installed
    if not os.path.exists('frontend/node_modules'):
        os.makedirs('frontend/node_modules')

    # Delete node_modules
    print('\033[93mDeleting node_modules directory...\033[0m')
    if os.name == 'posix':
        subprocess.run(['rm', '-rf', 'frontend/node_modules'])
    else:
        subprocess.run(['rmdir', '/s', '/q', 'frontend\\node_modules'], shell=True)

    print('\033[93mDeleting package-lock.json file...\033[0m')
    if os.name == 'posix':
        subprocess.run(['rm', 'frontend/package-lock.json'])
    else:
        subprocess.run(['del', '/q', 'frontend\\package-lock.json'], shell=True)

    print('\033[92mInstalling node_modules...\033[0m')

    if os.name == 'posix':
        subprocess.run(['npm', 'install'], cwd='frontend')
    else:
        subprocess.run(['npm', 'install'], cwd='frontend', shell=True)

    print('\033[92mNode modules installed.\033[0m')
    print('Starting app with\033[94m docker-compose\033[0m...')

    if check_command(['docker-compose', 'version']):
        try:
            subprocess.run(['docker-compose', 'up', '--build'], check=True)
        except subprocess.CalledProcessError as e:
            print(f"\033[91mError running 'docker-compose': {e}\033[0m")
    elif check_command(['docker', 'compose', 'version']):
        print('Starting app with\033[94m docker composed\033[0m instead...')
        try:
            subprocess.run(['docker', 'compose', 'up', '--build'], check=True)
        except subprocess.CalledProcessError as e:
            print(f"\033[91mError running 'docker compose': {e}\033[0m")
    else:
        print("\033[93mNeither 'docker compose' nor 'docker-compose' commands are available.\033[0m")
        print("\033[93m\tMake sure Docker is installed and running.\033[0m")

except KeyboardInterrupt:
    print("\n\033[91mExiting...\033[0m")

print("\033[93mBye-bye!\033[0m")
print('Run\033[94m docker compose down -v\033[0m to remove container + volumes (including DB data)')