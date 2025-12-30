#!/usr/bin/env python3
"""
Script auxiliar para executar testes Playwright e atualizar matriz automaticamente
"""

import subprocess
import sys
from pathlib import Path
from update_traceability_matrix import TraceabilityMatrixUpdater


def run_playwright_tests(project='chromium'):
    """
    Executa os testes do Playwright
    
    Args:
        project: Projeto a executar (chromium, firefox, webkit)
    """
    print(f"Executando testes Playwright no projeto: {project}\n")
    print("="*60)
    
    cmd = ['npx', 'playwright', 'test', f'--project={project}']
    
    try:
        result = subprocess.run(cmd, capture_output=False, text=True)
        print("="*60 + "\n")
        return result.returncode == 0
    except Exception as e:
        print(f"✗ Erro ao executar testes: {e}")
        return False


def main():
    """Função principal"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Executa testes Playwright e atualiza matriz de rastreabilidade'
    )
    parser.add_argument(
        '--project',
        default='chromium',
        choices=['chromium', 'firefox', 'webkit'],
        help='Projeto do Playwright a executar (padrão: chromium)'
    )
    parser.add_argument(
        '--skip-tests',
        action='store_true',
        help='Pular execução dos testes e apenas atualizar matriz'
    )
    parser.add_argument(
        '--matrix',
        default='matriz_rastreabilidade.xlsx',
        help='Caminho para a matriz de rastreabilidade'
    )
    
    args = parser.parse_args()
    
    # Executar testes se não for para pular
    if not args.skip_tests:
        success = run_playwright_tests(args.project)
        if not success:
            print("⚠ Testes concluídos com falhas. Continuando com atualização da matriz...\n")
    
    # Verificar se arquivo de resultados existe
    results_file = Path('test-results.json')
    if not results_file.exists():
        print("✗ Arquivo test-results.json não encontrado.")
        print("Execute os testes primeiro ou verifique a configuração do reporter no playwright.config.ts")
        sys.exit(1)
    
    # Atualizar matriz
    updater = TraceabilityMatrixUpdater(
        results_file='test-results.json',
        matrix_file=args.matrix
    )
    updater.run()


if __name__ == '__main__':
    main()
